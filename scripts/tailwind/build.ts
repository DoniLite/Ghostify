import { Command } from 'https://deno.land/x/cliffy@v1.0.0-rc.4/command/mod.ts';
// import { existsSync } from 'std/fs/mod.ts';

const ROOT_DIR = Deno.cwd();

const TAILWIND_CMD = 'npx';
const TAILWIND_ARGS = [
  '@tailwindcss/cli',
  '-i',
  `${ROOT_DIR}/main.css`,
  '-o',
  `${ROOT_DIR}/static/css/main.css`,
];

let isRunning = false;
// Pour éviter les builds en double
let lastBuildTime = 0;
const DEBOUNCE_TIME = 2000; // 2 secondes de délai

/**
 * Vérifier si le fichier de sortie existe
 */
// function isOutputGenerated(): boolean {
//   return existsSync(path.join(ROOT_DIR, 'static/css/main.css'));
// }

/**
 * Détermine si un fichier est pertinent pour Tailwind
 */
function isRelevantFile(filePath: string): boolean {
  // Ignore les fichiers qui ne sont pas pertinents pour Tailwind
  if (
    filePath.includes('node_modules') ||
    filePath.includes('.git') ||
    filePath.includes('/static/') || // Évite de réagir aux fichiers générés
    filePath.endsWith('.js') || // Fichiers compilés
    filePath.endsWith('.d.ts')
  ) {
    // Fichiers de déclaration
    return false;
  }

  // Surveille seulement les fichiers CSS, HTML, JSX, TSX ou le fichier Tailwind config
  return (
    filePath.endsWith('.css') ||
    filePath.endsWith('.html') ||
    filePath.endsWith('.jsx') ||
    filePath.endsWith('.tsx') ||
    filePath.includes('tailwind.config')
  );
}

/**
 * Démarrer le build Tailwind uniquement si nécessaire
 */
async function buildTailwind() {
  const now = Date.now();

  // Empêche les compilations trop fréquentes
  if (now - lastBuildTime < DEBOUNCE_TIME) {
    console.log('[INFO] Compilation ignorée (trop rapprochée)');
    return;
  }

  if (isRunning) {
    console.log('[INFO] Build déjà en cours, annulation...');
    return;
  }

  console.log('[INFO] Compilation Tailwind CSS en cours...');
  isRunning = true;
  lastBuildTime = now;

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

/**
 * Surveiller les fichiers Tailwind et déclencher un build si nécessaire
 */
async function watchFiles() {
  console.log('[INFO] Surveillance des fichiers CSS et composants...');

  try {
    // Surveillance à des endroits plus spécifiques
    const watcher = Deno.watchFs([
      `${ROOT_DIR}/src`,
      `${ROOT_DIR}/main.css`,
    ]);

    for await (const event of watcher) {
      // Vérifie si au moins un des fichiers modifiés est pertinent
      const relevantFiles = event.paths.filter(isRelevantFile);

      if (event.kind === 'modify' && relevantFiles.length > 0) {
        console.log('[INFO] Modification CSS/HTML détectée:', relevantFiles);
        await buildTailwind();
      }
    }
  } catch (error) {
    console.error(
      '[ERROR] Erreur lors de la surveillance des fichiers:',
      error
    );
  }
}

await new Command()
  .name('tailwind')
  .description('Tailwind CLI wrapper')
  .command('build', 'Build Tailwind CSS')
  .option('-w, --watch', 'Watch files for changes')
  .action(async ({ watch }) => {
    // Vérifie si le dossier de sortie existe, sinon le créer
    try {
      await Deno.mkdir(`${ROOT_DIR}/static/css`, { recursive: true });
    } catch (error) {
      if (!(error instanceof Deno.errors.AlreadyExists)) {
        console.error(
          '[ERROR] Erreur lors de la création du dossier de sortie:',
          error
        );
      }
    }

    if (watch) {
      await watchFiles();
    } else {
      await buildTailwind();
    }
  })
  .parse(Deno.args);