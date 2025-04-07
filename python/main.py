from datetime import datetime
from enum import Enum
import json
from random import randint
import shutil
from typing import Annotated, Any, Dict, List, Union
from pypandoc import get_pandoc_path
from python.utils.functions import purge_files_after_transform
from python.utils.pandoc_utils import (
    InputFormats,
    OutputFormats,
    convert_document,
    get_file_extension,
    get_supported_formats,
)
from python.utils.pandoc_downloader import download_pandoc_binary
import os

STATIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../static"))
ACCESS_TOKEN_EXPIRE_MINUTES = 30

try:
    pandoc_path = get_pandoc_path()
    print(f"pandoc binary successfully found {pandoc_path}")
except OSError:
    print("Pandoc not found, trying to download it.")
    download_pandoc_binary()
