from typing import List, Union
from googletrans import Translator, LANGCODES, LANGUAGES

translator = Translator()

def getLangCodes():
    return LANGCODES

def getLanguages():
    return LANGUAGES


def translate(text: Union[str, List[str]], src: str = 'auto', dest: str = 'en'):
    return translator.translate(text, src=src, dest=dest).text