from transformers import GPT2Tokenizer
import pandas as pd

tokenizer = GPT2Tokenizer.from_pretrained("openai-community/gpt2")
tokens = tokenizer("Ceci est un exemple de texte.", return_tensors="pt")
print(tokens)

