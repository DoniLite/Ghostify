import pypandoc


class PandocInputFormat(str, Enum):
    COMMONMARK = "commonmark"
    DOCBOOK = "docbook"
    DOCX = "docx"
    EPUB = "epub"
    HTML = "html"
    LATEX = "latex"
    MARKDOWN = "markdown"
    MARKDOWN_GITHUB = "markdown_github"
    MARKDOWN_MUSE = "markdown_muse"
    MARKDOWN_PHP = "markdown_php"
    MARKDOWN_STRICT = "markdown_strict"
    MEDIAWIKI = "mediawiki"
    NATIVE = "native"
    ODT = "odt"
    OPML = "opml"
    ORG = "org"
    RST = "rst"
    TEXTILE = "textile"
    TWIKI = "twiki"

class PandocOutputFormat(str, Enum):
    ASCII = "ascii"
    ASCIIDOC = "asciidoc"
    BEAMER = "beamer"
    COMMONMARK = "commonmark"
    CONTEXT = "context"
    DOCBOOK = "docbook"
    DOCX = "docx"
    DOKUWIKI = "dokuwiki"
    EPUB = "epub"
    EPUB2 = "epub2"
    EPUB3 = "epub3"
    FB2 = "fb2"
    HADDOCK = "haddock"
    HTML = "html"
    HTML5 = "html5"
    ICML = "icml"
    JATS = "jats"
    JSON = "json"
    LATEX = "latex"
    MAN = "man"
    MARKDOWN = "markdown"
    MARKDOWN_GITHUB = "markdown_github"
    MARKDOWN_MUSE = "markdown_muse"
    MARKDOWN_PHP = "markdown_php"
    MARKDOWN_STRICT = "markdown_strict"
    MEDIAWIKI = "mediawiki"
    NATIVE = "native"
    ODT = "odt"
    OPML = "opml"
    OPENDOCUMENT = "opendocument"
    ORG = "org"
    PDF = "pdf"
    PLAIN = "plain"
    PPTX = "pptx"
    RST = "rst"
    RTF = "rtf"
    TEXINFO = "texinfo"
    TEXTILE = "textile"
    SLIDEOUS = "slideous"
    SLIDY = "slidy"
    DZSLIDES = "dzslides"
    REVEALJS = "revealjs"
    S5 = "s5"


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
    
def convert_document(input_file: str, 
                    from_format: PandocInputFormat, 
                    to_format: PandocOutputFormat, 
                    output_file: str) -> None:
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
            outputfile=output_file
        )
        print(f"Conversion réussie : {output_file}")
    except Exception as e:
        print(f"Erreur lors de la conversion : {str(e)}")

# Exemple d'utilisation
if __name__ == "__main__":
    convert_document(
        "document.md",
        PandocInputFormat.MARKDOWN,
        PandocOutputFormat.PDF,
        "output.pdf"
    )

    # Vérifier les formats disponibles
    print("\nFormats d'entrée disponibles:")
    for format in PandocInputFormat:
        print(f"- {format.value}")

    print("\nFormats de sortie disponibles:")
    for format in PandocOutputFormat:
        print(f"- {format.value}")