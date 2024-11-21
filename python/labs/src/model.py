import torch
import torch.nn as nn
from transformers import BertModel, GPT2LMHeadModel, BertTokenizer, GPT2Tokenizer

class HybridBERTGPT2Model(nn.Module):
    def __init__(self, bert_model_name='bert-base-uncased', 
                 gpt2_model_name='gpt2', 
                 bert_tokenizer='../models/tokenizer/bertz', 
                 gpt2_tokenizer='../models/tokenizer/gpt2',
                 embedding_dim=768, 
                 hidden_dim=768):
        super(HybridBERTGPT2Model, self).__init__()
        
        # Chargement des modèles pré-entraînés
        self.bert_encoder = BertModel.from_pretrained(bert_model_name)
        self.gpt2_generator = GPT2LMHeadModel.from_pretrained(gpt2_model_name)
        
        # Chargement des tokenizers
        self.bert_tokenizer = BertTokenizer.from_pretrained(bert_tokenizer)
        self.gpt2_tokenizer = GPT2Tokenizer.from_pretrained(gpt2_tokenizer)
        
        # Couches supplémentaires pour l'adaptation
        self.adaptation_layer = nn.Sequential(
            nn.Linear(embedding_dim, hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.3)
        )
        
        # Couche de recherche d'information
        self.information_retrieval_layer = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.ReLU(),
            nn.Linear(hidden_dim // 2, embedding_dim)
        )
    def encode_input(self, text):
        """Encodage de l'entrée avec BERT"""
        inputs = self.bert_tokenizer(text, return_tensors='pt', 
                                     padding=True, truncation=True)
        outputs = self.bert_encoder(**inputs)
        return outputs.last_hidden_state.mean(dim=1)  # Moyenne sur la séquence
    
    def generate_text(self, prompt, max_length=100):
        """Génération de texte avec GPT-2"""
        inputs = self.gpt2_tokenizer(prompt, return_tensors='pt')
        outputs = self.gpt2_generator.generate(
            inputs.input_ids, 
            max_length=max_length, 
            num_return_sequences=1, 
            no_repeat_ngram_size=2
        )
        return self.gpt2_tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    def retrieve_information(self, query, context_embeddings):
        """Recherche d'information basée sur la similarité"""
        query_embedding = self.encode_input(query)
        
        # Assurer que query_embedding est de la même forme que context_embeddings
        query_embedding = query_embedding.unsqueeze(0)
        
        # Calcul de similarité cosinus
        similarity = torch.cosine_similarity(query_embedding, context_embeddings.mean(dim=1), dim=1)
        
        # Sélection des passages les plus pertinents
        top_k_indices = torch.topk(similarity, k=min(3, len(similarity))).indices
        return context_embeddings[top_k_indices]
    
    def forward(self, input_text, query=None):
        """Passage complet à travers le réseau"""
        # Encodage BERT
        bert_embeddings = self.encode_input(input_text)
        
        # Adaptation des embeddings
        adapted_embeddings = self.adaptation_layer(bert_embeddings)
        
        # Recherche d'information conditionnelle
        if query:
            retrieved_info = self.retrieve_information(query, adapted_embeddings)
        else:
            retrieved_info = adapted_embeddings
        
        # Génération de texte
        generated_text = self.generate_text(input_text)
        
        return {
            'embeddings': adapted_embeddings,
            'retrieved_info': retrieved_info,
            'generated_text': generated_text
        }
# Exemple d'utilisation
def main():
    # Initialisation du modèle
    model = HybridBERTGPT2Model(bert_model_name='../models/model/bertz', gpt2_model_name='../models/model/gpt2')
    
    # Exemple de texte d'entrée
    input_text = "Le machine learning est un domaine fascinant de l'intelligence artificielle."
    query = "Quels sont les principes du machine learning ?"
    
    # Passage à travers le réseau
    results = model(input_text, query)
    
    print("Texte généré:", results['generated_text'])
    print("Informations récupérées:", results['retrieved_info'].shape)

if __name__ == "__main__":
    main()