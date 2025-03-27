import { render, useRef } from 'npm:hono/jsx/dom';

const outputFormats = [
  'asciidoc',
  'asciidoctor',
  'beamer',
  'biblatex',
  'bibtex',
  'chunkedhtml',
  'commonmark',
  'commonmark_x',
  'context',
  'csljson',
  'docbook',
  'docbook4',
  'docbook5',
  'docx',
  'dokuwiki',
  'dzslides',
  'epub',
  'epub2',
  'epub3',
  'fb2',
  'gfm',
  'haddock',
  'html',
  'html4',
  'html5',
  'icml',
  'ipynb',
  'jats',
  'jats_archiving',
  'jats_articleauthoring',
  'jats_publishing',
  'jira',
  'json',
  'latex',
  'man',
  'markdown',
  'markdown_github',
  'markdown_mmd',
  'markdown_phpextra',
  'markdown_strict',
  'markua',
  'mediawiki',
  'ms',
  'muse',
  'native',
  'odt',
  'opendocument',
  'opml',
  'org',
  'pdf',
  'plain',
  'pptx',
  'revealjs',
  'rst',
  'rtf',
  's5',
  'slideous',
  'slidy',
  'tei',
  'texinfo',
  'textile',
  'typst',
  'xwiki',
  'zimwiki',
] as const;

const dropArea = useRef<HTMLDivElement>(null);
const fileInput = useRef<HTMLInputElement>(null);

const Document = () => {
  return (
    <div class='p-6 bg-gray-950 w-screen h-screen flex flex-col gap-y-4 justify-center items-center'>
      <h2 class='text-xl font-semibold text-white text-center'>
        Uploader un Document
      </h2>

      <form
        id='uploadForm'
        method='post'
        action='/api/v1/poster/parser'
        class='space-y-4 max-w-3xl rounded-lg mb-4'
      >
        <div id='chooseFormat' class='flex-col space-y-4 w-full my-8 hidden'>
          <label
            for='outputFormat'
            class='block text-sm text-orange-600 font-bold'
          >
            Choisissez un format de sortie :
          </label>

          <select
            id='outputFormat'
            name='outputFormat'
            class='block w-full rounded-md p-3 text-orange-600 font-bold border-gray-300 shadow-sm focus:border-gray-950 focus:ring-gray-950 sm:text-sm'
          >
            {outputFormats.map((format) => (
              <option value={format}>{format}</option>
            ))}
          </select>
        </div>

        <div
          id='dropArea'
          ref={dropArea}
          onDragleave={handleDragLeave}
          onDrop={handleDrop}
          onDragover={handleDragOver}
          onClick={() => fileInput.current?.click()}
          class='flex p-4 w-full text-center items-center justify-center h-40 border-2 border-dashed rounded-lg border-orange-500 bg-orange-200 text-orange-600 hover:bg-gray-100 transition-colors duration-300 cursor-pointer'
        >
          Glissez et déposez un fichier ou cliquez pour en sélectionner un
        </div>
        <input
          id='fileInput'
          onChange={handleFileChange}
          ref={fileInput}
          type='file'
          name='file'
          class='hidden'
        />

        <div
          id='fileInfo'
          class='hidden p-3 bg-gray-100 rounded-lg text-gray-700 space-y-2'
        >
          <p>
            <strong>Nom :</strong> <span id='fileName'></span>
          </p>
          <p>
            <strong>Taille :</strong> <span id='fileSize'></span> KB
          </p>
          <p>
            <strong>Type :</strong> <span id='fileType'></span>
          </p>
        </div>

        <button
          type='submit'
          class='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none'
        >
          Uploader
        </button>
      </form>
    </div>
  );
};


function handleDragOver(event: Event) {
  event.preventDefault();
  dropArea.current?.classList.add('bg-blue-50', 'border-blue-400');
  dropArea.current?.classList.remove('bg-gray-50', 'border-dashed');
}

// Désactiver l'effet de survol
function handleDragLeave(event: DragEvent) {
  event.preventDefault();
  dropArea.current?.classList.remove('bg-blue-50', 'border-blue-400');
  dropArea.current?.classList.add('bg-gray-50', 'border-dashed');
}

// Gestion du fichier déposé
function handleDrop(event: DragEvent) {
  event.preventDefault();
  dropArea.current?.classList.remove('bg-blue-50', 'border-blue-400');
  const file = event.dataTransfer?.files[0];
  if (file) {
    displayFileInfo(file);
  }
}

// Gestion du changement de fichier (pour le clic)
function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    displayFileInfo(file);
  }
}

// Afficher les informations du fichier
function displayFileInfo(file: File) {
  document!.getElementById('fileName')!.textContent = file.name;
  document!.getElementById('fileSize')!.textContent = (file.size / 1024).toFixed(
    2
  );
  document!.getElementById('fileType')!.textContent = file.type;
  document!.getElementById('fileInfo')!.classList.remove('hidden');
  document!.getElementById('chooseFormat')!.classList.remove('hidden');
  document!.getElementById('chooseFormat')!.classList.add('flex');
}

const root = document.getElementById('root')!;

render(<Document />, root);
