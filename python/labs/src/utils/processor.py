from typing import Dict, Union
from transformers import AutoTokenizer


some_model = ""
tokenizer = AutoTokenizer.from_pretrained(some_model)


def load_model(model_name):
    return AutoTokenizer.from_pretrained(model_name)


def encode_inputs(inputs: str):
    return tokenizer(inputs, padding=True, truncation=True, return_tensors="pt")


def decode_inputs(
    encoded_inputs: Dict[str, Dict[str, Union[int, float]]], id: Union[int, float]
):
    return tokenizer.decode(encoded_inputs[id])
