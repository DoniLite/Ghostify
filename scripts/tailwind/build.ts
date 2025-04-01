import { Command } from 'https://deno.land/x/cliffy@v1.0.0-rc.4/command/mod.ts';

const ROOT_DIR = Deno.cwd();
const DEBOUNCE_TIME = 2000; // 2 secondes de délai
const TAILWIND_CMD = 'npx';
const TAILWIND_ARGS = [
  '@tailwindcss/cli',
  '-i',
  `${ROOT_DIR}/main.css`,
  '-o',
  `${ROOT_DIR}/static/css/main.css`,
];

let isRunning = false;
let timeoutId: number | undefined;

// Expression régulière pour les extensions de fichiers pertinentes
const RELEVANT_EXT_REGEX = /\.(css|html|jsx|tsx)$/;

function isRelevantFile(filePath: string): boolean {
  // Ignore les dossiers système et les fichiers générés
  if (
    filePath.includes('node_modules') ||
    filePath.includes('.git') ||
    filePath.includes('/static/')
  ) {
    return false;
  }

  // Vérifie le fichier de configuration Tailwind
  if (filePath.endsWith('tailwind.config.js')) {
    return true;
  }

  // Vérifie les extensions pertinentes
  return RELEVANT_EXT_REGEX.test(filePath);
}

async function buildTailwind() {
  if (isRunning) {
    console.log('[INFO] Build déjà en cours, annulation...');
    return;
  }

  console.log('[INFO] Compilation Tailwind CSS en cours...');
  isRunning = true;

  try {
    const process = new Deno.Command(TAILWIND_CMD, {
      args: TAILWIND_ARGS,
      stdout: 'piped',
      stderr: 'piped',
    });

    const { code, stdout, stderr } = await process.output();

    console.log(new TextDecoder().decode(stdout));

    if (stderr.length > 0) {
      console.error(new TextDecoder().decode(stderr));
    }

    if (code === 0) {
      console.log('[INFO] Compilation réussie ✅');
    } else {
      console.error('[ERROR] Échec de la compilation ❌');
    }
  } catch (error) {
    console.error('[ERROR] Exception lors de la compilation:', error);
  } finally {
    isRunning = false;
  }
}

async function watchFiles() {
  console.log('[INFO] Surveillance des fichiers CSS et composants...');

  try {
    // Création du dossier de sortie
    await Deno.mkdir(`${ROOT_DIR}/static/css`, { recursive: true });

    // Build initial
    await buildTailwind();

    // Surveillance ciblée sur les fichiers pertinents
    const watcher = Deno.watchFs([
      `${ROOT_DIR}/src`,
      `${ROOT_DIR}/main.css`,
      `${ROOT_DIR}/tailwind.config.js`,
    ]);

    for await (const event of watcher) {
      const relevantFiles = event.paths.filter(isRelevantFile);

      if (event.kind === 'modify' && relevantFiles.length > 0) {
        console.log('[INFO] Modification détectée:', relevantFiles);

        // Annule le timeout précédent
        if (timeoutId !== undefined) clearTimeout(timeoutId);

        // Démarre un nouveau délai
        timeoutId = setTimeout(async () => {
          await buildTailwind();
          timeoutId = undefined;
        }, DEBOUNCE_TIME);
      }
    }
  } catch (error) {
    console.error('[ERROR] Erreur lors de la surveillance:', error);
    Deno.exit(1);
  }
}

await new Command()
  .name('tailwind')
  .description('Tailwind CLI wrapper optimisé')
  .command('build', 'Build Tailwind CSS')
  .option('-w, --watch', 'Active la surveillance des fichiers')
  .action(async ({ watch }) => {
    if (watch) {
      await watchFiles();
    } else {
      await buildTailwind();
    }
  })
  .parse(Deno.args);
