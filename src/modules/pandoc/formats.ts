import { InputFormats, OutputFormats } from '../../utils/const/pandoc_enums.ts';

/**
 * A comprehensive mapping of input/output formats to their typical file extensions.
 * This object is designed to be type-safe, ensuring only valid formats are used as keys.
 */
const formatToExtensionMap = {
	[InputFormats.BIBLATEX]: '.bib',
	[InputFormats.BIBTEX]: '.bib',
	[InputFormats.CSV]: '.csv',
	[InputFormats.DOCX]: '.docx',
	[InputFormats.EPUB]: '.epub',
	[InputFormats.FB2]: '.fb2',
	[InputFormats.HTML]: '.html',
	[InputFormats.IPYNB]: '.ipynb',
	[InputFormats.JSON]: '.json',
	[InputFormats.LATEX]: '.tex',
	[InputFormats.MARKDOWN]: '.md',
	[InputFormats.ODT]: '.odt',
	[InputFormats.RIS]: '.ris',
	[InputFormats.RTF]: '.rtf',
	[InputFormats.TSV]: '.tsv',
	[InputFormats.TEXTILE]: '.textile',
	[InputFormats.VIMWIKI]: '.wiki',
	[OutputFormats.PDF]: '.pdf',
	[OutputFormats.PLAIN]: '.txt',
	[OutputFormats.PPTX]: '.pptx',
} as const;

/**
 * Retrieves the file extension for a given input or output format.
 *
 * @param formatEnum The input or output format (e.g., InputFormats.BIBLATEX, OutputFormats.PDF).
 * @returns The file extension (e.g., ".bib", ".pdf") or `undefined` if no mapping exists.
 */
export function getFileExtension(
	formatEnum: InputFormats | OutputFormats,
): string | undefined {
	return formatToExtensionMap[formatEnum as keyof typeof formatToExtensionMap];
}
