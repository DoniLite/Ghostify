import os
import torch
import torch.nn as nn
from torch.nn import functional as F
from transformers import BertModel, GPT2LMHeadModel, BertTokenizer, GPT2Tokenizer


device = (
    "cuda"
    if torch.cuda.is_available()
    else "mps" if torch.backends.mps.is_available() else "cpu"
)


class InformationContexts:
    def __init__(self, contexts=None):
        self.contexts = contexts or [
            "Le machine learning utilise des algorithmes pour apprendre à partir de données.",
            "L'intelligence artificielle cherche à créer des systèmes capables d'imiter l'intelligence humaine.",
            "Les réseaux de neurones sont inspirés du fonctionnement du cerveau humain.",
            "L'apprentissage profond permet aux modèles de comprendre des structures complexes.",
            "Les données sont essentielles pour entraîner des modèles d'intelligence artificielle."
        ]

    def get_contexts(self):
        return self.contexts


class HybridBERTGPT2Model(nn.Module):
    def __init__(
        self,
        bert_model_name="bert-base-uncased",
        gpt2_model_name="gpt2",
        bert_tokenizer="../models/tokenizer/bertz",
        gpt2_tokenizer="../models/tokenizer/gpt2",
        embedding_dim=768,
        context_manager=None,
    ):
        # Vérifier l'existence des chemins
        
        
        if not os.path.exists(bert_tokenizer):
            print(f"Chemin du tokenizer BERT invalide : {bert_tokenizer}")
            bert_tokenizer = "bert-base-uncased"
        
        if not os.path.exists(gpt2_tokenizer):
            print(f"Chemin du tokenizer GPT-2 invalide : {gpt2_tokenizer}")
            gpt2_tokenizer = "gpt2"
        
        super(HybridBERTGPT2Model, self).__init__()
        
        self.context_manager = context_manager or InformationContexts()

        # Chargement des modèles pré-entraînés
        self.bert_encoder = BertModel.from_pretrained(bert_model_name)
        self.gpt2_generator = GPT2LMHeadModel.from_pretrained(gpt2_model_name)

        # Chargement des tokenizers
        self.bert_tokenizer = BertTokenizer.from_pretrained(bert_tokenizer)
        self.gpt2_tokenizer = GPT2Tokenizer.from_pretrained(gpt2_tokenizer)

        # Configuration explicite des tokens spéciaux
        self.gpt2_tokenizer.pad_token = self.gpt2_tokenizer.eos_token
        self.gpt2_generator.config.pad_token_id = self.gpt2_tokenizer.pad_token_id

        # Couche d'adaptation pour uniformiser les dimensions
        self.embedding_adapter = nn.Sequential(
            nn.Linear(self.bert_encoder.config.hidden_size, embedding_dim),
            nn.ReLU(),
            nn.Dropout(0.3),
        )

        # Couche de projection pour la recherche d'information
        self.info_projector = nn.Linear(embedding_dim, embedding_dim)
        
        # Pre-compute context embeddings
        context_embeddings = torch.stack([
            self.encode_input(text) for text in self.context_texts
        ])
        self.cached_context_projected = self.info_projector(context_embeddings)

    def encode_input(self, text, return_tensor=True):
        """Encodage de l'entrée avec BERT"""
        # Gérer les cas où l'entrée est None ou vide
        if not text:
            return (
                torch.zeros(1, self.bert_encoder.config.hidden_size)
                if return_tensor
                else None
            )

        # Tokenisation et encodage
        inputs = self.bert_tokenizer(
            text, return_tensors="pt", padding=True, truncation=True, max_length=512
        )

        # S'assurer que les inputs sont sur le bon device
        inputs = {k: v.to(self.bert_encoder.device) for k, v in inputs.items()}

        # Passage à travers BERT
        with torch.no_grad():
            outputs = self.bert_encoder(**inputs)


        return outputs.last_hidden_state[:, 0, :]

    def retrieve_information(self, query, k=3):
        """
        Recherche d'informations similaires basée sur la similarité cosinus

        Args:
        - query (str): Requête de recherche
        - context_embedding (torch.Tensor, optional): Contexte encodé (embeddings)
        - k (int): Nombre de passages à récupérer

        Returns:
        - str: Passages textuels les plus pertinents
        """
        # Si pas de requête, retourner un texte par défaut
        if not query:
            return "Aucune requête spécifiée."

        query_embedding = self.encode_input(query)
        context_embeddings = torch.stack([
            self.encode_input(text) for text in self.context_manager.get_contexts()
        ])

        similarities = F.cosine_similarity(
            self.info_projector(query_embedding),
            self.info_projector(context_embeddings),
            dim=-1
        )

        top_k = min(k, len(self.context_manager.get_contexts()))
        top_indices = torch.topk(F.softmax(similarities, dim=0), top_k).indices

        return " ".join([self.context_manager.get_contexts()[i] for i in top_indices])

    def generate_text(self, prompt, max_length=100):
        """Génération de texte avec GPT-2"""
        # Gérer les cas où le prompt est None ou vide
        if not prompt:
            prompt = "Le"

        # Tokenisation avec gestion explicite du padding
        inputs = self.gpt2_tokenizer(
            prompt, return_tensors="pt", truncation=True, padding=True, max_length=50
        )

        # S'assurer que les inputs sont sur le bon device
        inputs = {k: v.to(self.gpt2_generator.device) for k, v in inputs.items()}

        # Génération avec paramètres améliorés
        generation_output = self.gpt2_generator.generate(
            input_ids=inputs["input_ids"],  # Spécifier explicitement input_ids
            attention_mask=inputs.get(
                "attention_mask"
            ),  # Passer attention_mask séparément
            max_length=max_length,
            num_return_sequences=1,
            no_repeat_ngram_size=2,
            do_sample=True,
            top_k=50,
            top_p=0.95,
            temperature=0.7,
        )

        try:
            return self.gpt2_tokenizer.decode(
                generation_output[0], skip_special_tokens=True
            )
        except Exception as e:
            print(f"Erreur de génération de texte : {e}")
            return "Génération de texte impossible"

    def forward(self, input_text, query=None):
        """Passage complet à travers le réseau"""
        # S'assurer que le modèle est sur le bon device
        self.to(device)

        if isinstance(input_text, torch.Tensor):
            input_text = self.gpt2_tokenizer.decode(input_text[0])

        # Encoder le texte d'entrée
        input_embedding = self.encode_input(input_text)

        # Adapter les embeddings
        adapted_embeddings = self.embedding_adapter(input_embedding)

        # Recherche d'information conditionnelle
        retrieved_info = self.retrieve_information(query, adapted_embeddings)

        # Génération de texte
        generated_text = self.generate_text(input_text)

        return {
            "embeddings": adapted_embeddings,
            "retrieved_info": retrieved_info,
            "generated_text": generated_text,
        }


# Exemple d'utilisation
def main():
    # Initialisation du modèle
    model = HybridBERTGPT2Model(
        bert_model_name="../models/model/bertz", gpt2_model_name="../models/model/gpt2"
    )

    # Exemple de texte d'entrée
    input_text = (
        "Le machine learning est un domaine fascinant de l'intelligence artificielle."
    )
    query = "Quels sont les principes du machine learning ?"

    # Passage à travers le réseau
    results = model(input_text, query)

    print("Texte généré:", results["generated_text"])
    print("Informations récupérées:", results["retrieved_info"])


if __name__ == "__main__":
    main()