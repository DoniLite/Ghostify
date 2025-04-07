// browser-manager.ts
import { Command } from 'https://deno.land/x/cliffy@v1.0.0-rc.4/command/mod.ts';
import { exec } from 'https://deno.land/x/exec@0.0.5/mod.ts';
import { exists } from 'std/fs/mod.ts';
import { join } from 'std/path/mod.ts';

// Config
const REPO_URL = 'https://github.com/lightpanda-io/browser';
const INSTALL_DIR = './.lightpanda-browser';
const PLATFORM_MAPPING: Record<string, string> = {
  windows: 'win',
  darwin: 'macos',
  linux: 'linux',
};

// Détecter la plateforme
const platform = PLATFORM_MAPPING[Deno.build.os] || 'linux';
const arch = Deno.build.arch;
const binaryName = `lightpanda`;

async function installBrowser(force = false) {
  // Vérifier si déjà installé
  if (!force && (await exists(join(INSTALL_DIR, binaryName)))) {
    console.log('Browser déjà installé.');
    return true;
  }

  if (platform === 'win') {
    console.log(
      'No binary for this os available please try using the official API instead.'
    );
    return false;
  }

  // Télécharger le binaire
  const downloadUrl = `${REPO_URL}/releases/latest/download/lightpanda-${arch}-${platform}`;
  console.log(`Téléchargement depuis ${downloadUrl}...`);

  try {
    // Télécharger et dézipper
    await exec(`mkdir -p ${INSTALL_DIR}`);
    await exec(`curl -L ${downloadUrl} -o ${INSTALL_DIR}/${binaryName}`);
    // await exec(`unzip -o ${INSTALL_DIR}/browser.zip -d ${INSTALL_DIR}`);
    // await exec(`chmod +x ${INSTALL_DIR}/${binaryName}`); // Pour Linux/macOS
    await exec(`chmod +x ${INSTALL_DIR}/${binaryName}`);

    // Nettoyer
    // await exec(`rm ${INSTALL_DIR}/browser.zip`);

    console.log('Installation terminée avec succès.');
    return true;
  } catch (error) {
    console.error("Erreur lors de l'installation:", error);
    return false;
  }
}

// Définir l'interface de ligne de commande
await new Command()
  .name('browser')
  .description('Gestionnaire pour LightPanda Browser')
  .version('1.0.0')

  .command('install')
  .description('Installer ou mettre à jour LightPanda Browser')
  .option('-f, --force', 'Forcer la réinstallation même si déjà installé')
  .action(async (options) => {
    await installBrowser(options.force);
  })
  .parse(Deno.args);
