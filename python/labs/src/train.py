from typing import Literal
from transformers import BertTokenizer, BertModel, GPT2Tokenizer, GPT2Model
import os

bertz_model_name: Literal["bert-base-uncased"] = "bert-base-uncased"
gpt2_model_name = "gpt2"
bertz_tokenizer = BertTokenizer.from_pretrained(bertz_model_name)
bertz_model = BertModel.from_pretrained(bertz_model_name)
gpt2_model = GPT2Model.from_pretrained(gpt2_model_name)
gpt2_tokenizer = GPT2Tokenizer.from_pretrained(gpt2_model_name)

# Sauvegarder localement
bertz_model.save_pretrained(os.path.abspath(__file__, "../models/model/bertz"))
bertz_tokenizer.save_pretrained(os.path.abspath("../models/tokenizer/bertz"))
gpt2_model.save_pretrained(os.path.abspath("../models/model/gpt2"))
gpt2_tokenizer.save_pretrained(os.path.abspath("../models/tokenizer/gpt2"))
