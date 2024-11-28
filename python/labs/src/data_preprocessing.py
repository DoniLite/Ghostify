import os
from transformers import GPT2Tokenizer
import pandas as pd

DATA_DIR = os.path.abspath("../data")

TRAIN_DIR = os.path.join(DATA_DIR, "train")

resume_data = os.path.join(TRAIN_DIR, "Resume.csv")

tokenizer = GPT2Tokenizer.from_pretrained("openai-community/gpt2")
tokens = tokenizer("Ceci est un exemple de texte.", return_tensors="pt")
print(tokens)

data = pd.read_csv(resume_data)
