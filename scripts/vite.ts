// scripts/build.ts
import { parseArgs } from 'https://deno.land/std@0.224.0/cli/parse_args.ts';

const { watch } = parseArgs(Deno.args, {
  boolean: ['watch'],
  default: { watch: false },
});

// Commande Vite à exécuter
const command = watch ? 'dev' : 'build';

const viteProcess = new Deno.Command('deno', {
  args: [
    'run',
    '-A',
    'npm:vite',
    command,
    '--config',
    './vite.config.ts',
  ],
  stdout: 'inherit',
  stderr: 'inherit',
});

const { code } = await viteProcess.output();

if (code !== 0) {
  console.error(`Vite ${command} failed with code ${code}`);
  Deno.exit(code);
}

console.log(`Vite ${command} completed successfully!`);
