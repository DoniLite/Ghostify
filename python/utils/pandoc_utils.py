from enum import Enum
from typing import Union
import pypandoc


class InputFormats(Enum):
    BIBLATEX = "biblatex"
    BIBTEX = "bibtex"
    COMMONMARK = "commonmark"
    COMMONMARK_X = "commonmark_x"
    CREOLE = "creole"
    CSLJSON = "csljson"
    CSV = "csv"
    DOCBOOK = "docbook"
    DOCX = "docx"
    DOKUWIKI = "dokuwiki"
    ENDNOTEXML = "endnotexml"
    EPUB = "epub"
    FB2 = "fb2"
    GFM = "gfm"
    HADDOCK = "haddock"
    HTML = "html"
    IPYNB = "ipynb"
    JATS = "jats"
    JIRA = "jira"
    JSON = "json"
    LATEX = "latex"
    MAN = "man"
    MARKDOWN = "markdown"
    MARKDOWN_GITHUB = "markdown_github"
    MARKDOWN_MMD = "markdown_mmd"
    MARKDOWN_PHP_EXTRA = "markdown_phpextra"
    MARKDOWN_STRICT = "markdown_strict"
    MEDIAWIKI = "mediawiki"
    MUSE = "muse"
    NATIVE = "native"
    ODT = "odt"
    OPML = "opml"
    ORG = "org"
    RIS = "ris"
    RST = "rst"
    RTF = "rtf"
    T2T = "t2t"
    TEXTILE = "textile"
    TIKIWIKI = "tikiwiki"
    TSV = "tsv"
    TWIKI = "twiki"
    TYPST = "typst"
    VIMWIKI = "vimwiki"


class OutputFormats(Enum):
    ASCIIDOC = "asciidoc"
    ASCIIDOCTOR = "asciidoctor"
    BEAMER = "beamer"
    BIBLATEX = "biblatex"
    BIBTEX = "bibtex"
    CHUNKEDHTML = "chunkedhtml"
    COMMONMARK = "commonmark"
    COMMONMARK_X = "commonmark_x"
    CONTEXT = "context"
    CSLJSON = "csljson"
    DOCBOOK = "docbook"
    DOCBOOK4 = "docbook4"
    DOCBOOK5 = "docbook5"
    DOCX = "docx"
    DOKUWIKI = "dokuwiki"
    DZSLIDES = "dzslides"
    EPUB = "epub"
    EPUB2 = "epub2"
    EPUB3 = "epub3"
    FB2 = "fb2"
    GFM = "gfm"
    HADDOCK = "haddock"
    HTML = "html"
    HTML4 = "html4"
    HTML5 = "html5"
    ICML = "icml"
    IPYNB = "ipynb"
    JATS = "jats"
    JATS_ARCHIVING = "jats_archiving"
    JATS_ARTICLE_AUTHORING = "jats_articleauthoring"
    JATS_PUBLISHING = "jats_publishing"
    JIRA = "jira"
    JSON = "json"
    LATEX = "latex"
    MAN = "man"
    MARKDOWN = "markdown"
    MARKDOWN_GITHUB = "markdown_github"
    MARKDOWN_MMD = "markdown_mmd"
    MARKDOWN_PHP_EXTRA = "markdown_phpextra"
    MARKDOWN_STRICT = "markdown_strict"
    MARKUA = "markua"
    MEDIAWIKI = "mediawiki"
    MS = "ms"
    MUSE = "muse"
    NATIVE = "native"
    ODT = "odt"
    OPENDOCUMENT = "opendocument"
    OPML = "opml"
    ORG = "org"
    PDF = "pdf"
    PLAIN = "plain"
    PPTX = "pptx"
    REVEALJS = "revealjs"
    RST = "rst"
    RTF = "rtf"
    S5 = "s5"
    SLIDEOUS = "slideous"
    SLIDY = "slidy"
    TEI = "tei"
    TEXINFO = "texinfo"
    TEXTILE = "textile"
    TYPST = "typst"
    XWIKI = "xwiki"
    ZIMWIKI = "zimwiki"


def get_supported_formats():
    """Retourne les formats supportés par l'installation locale de pandoc."""
    try:
        input_formats = pypandoc.get_pandoc_formats()[0]
        output_formats = pypandoc.get_pandoc_formats()[1]

        print("Formats d'entrée supportés:", input_formats)
        print("Formats de sortie supportés:", output_formats)

        return input_formats, output_formats
    except Exception as e:
        print(f"Erreur lors de la récupération des formats : {str(e)}")
        return [], []


def convert_document(
    input_file: str,
    from_format: InputFormats,
    to_format: OutputFormats,
    output_file: str,
) -> None:
    """
    Convertit un document d'un format à un autre en utilisant pypandoc.

    Args:
        input_file (str): Chemin du fichier d'entrée
        from_format (PandocInputFormat): Format d'entrée
        to_format (PandocOutputFormat): Format de sortie
        output_file (str): Chemin du fichier de sortie
    """
    try:
        output = pypandoc.convert_file(
            input_file,
            to_format.value,
            format=from_format.value,
            outputfile=output_file,
        )
        print(f"Conversion réussie : {output_file}")
    except Exception as e:
        print(f"Erreur lors de la conversion : {str(e)}")
        raise e


# Fonction pour retourner les extensions
def get_file_extension(format_enum: Union[InputFormats, OutputFormats]):
    format_to_extension = {
        InputFormats.BIBLATEX: ".bib",
        InputFormats.BIBTEX: ".bib",
        InputFormats.CSV: ".csv",
        InputFormats.DOCX: ".docx",
        InputFormats.EPUB: ".epub",
        InputFormats.FB2: ".fb2",
        InputFormats.HTML: ".html",
        InputFormats.IPYNB: ".ipynb",
        InputFormats.JSON: ".json",
        InputFormats.LATEX: ".tex",
        InputFormats.MARKDOWN: ".md",
        InputFormats.ODT: ".odt",
        InputFormats.RIS: ".ris",
        InputFormats.RTF: ".rtf",
        InputFormats.TSV: ".tsv",
        InputFormats.TEXTILE: ".textile",
        InputFormats.VIMWIKI: ".wiki",
        OutputFormats.PDF: ".pdf",
        OutputFormats.PLAIN: ".txt",
        OutputFormats.DOCX: ".docx",
        OutputFormats.HTML: ".html",
        OutputFormats.MARKDOWN: ".md",
        OutputFormats.PPTX: ".pptx",
    }

    # Cherche l'extension correspondante
    return format_to_extension.get(format_enum)


# Exemple d'utilisation
if __name__ == "__main__":
    convert_document(
        "document.md", InputFormats.MARKDOWN, OutputFormats.PDF, "output.pdf"
    )

    # Vérifier les formats disponibles
    print("\nFormats d'entrée disponibles:")
    for format in InputFormats:
        print(f"- {format.value}")

    print("\nFormats de sortie disponibles:")
    for format in OutputFormats:
        print(f"- {format.value}")
