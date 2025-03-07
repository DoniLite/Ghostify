import { build, stop } from 'https://deno.land/x/esbuild@v0.20.1/mod.js';
import { denoPlugins } from 'https://deno.land/x/esbuild_deno_loader@0.9.0/mod.ts';
import { parseArgs } from 'https://deno.land/std@0.224.0/cli/parse_args.ts';
import { ensureDir } from 'https://deno.land/std@0.220.1/fs/ensure_dir.ts';
import { glob } from 'glob';
import path from 'node:path';
import process from "node:process";

const flags = parseArgs(Deno.args, {
  boolean: ['watch'],
  default: { watch: false },
});

// Ensure build directory exists
await ensureDir(path.join(process.cwd(), '/src/public/js'));

try {
  const _result = await build({
    entryPoints: [
      ...glob
        .sync(['./src/frontend/**/*.ts', './src/frontend/**/*.js'])
        .map((file) => path.resolve(process.cwd(), file)),
    ], // Votre point d'entrée principal
    bundle: true,
    minify: !flags.watch,
    sourcemap: flags.watch ? 'inline' : false,
    target: ['chrome99', 'firefox99', 'safari15'],
    outdir: path.join(process.cwd(), '/src/public/js'),
    format: 'esm',
    platform: 'browser',
    plugins: [
      ...denoPlugins({
        nodeModulesDir: true,
      }),
      // {
      //   name: 'node_modules',
      //   setup(build) {
      //     // Gérer les imports de node_modules
      //     build.onResolve({ filter: /^[^./]|^\.[^./]|^\.\.[^/]/ }, (args) => {
      //       if (args.kind === 'import-statement') {
      //         return {
      //           path: args.path,
      //           namespace: 'node_modules',
      //         };
      //       }
      //     });

      //     build.onLoad(
      //       { filter: /.*/, namespace: 'node_modules' },
      //       async (args) => {
      //         try {
      //           const module = await import(args.path);
      //           return {
      //             contents: `export default ${JSON.stringify(module)}`,
      //             loader: 'js',
      //           };
      //         } catch (e) {
      //           console.error(`Failed to load ${args.path}:`, e);
      //           return { contents: '' };
      //         }
      //       }
      //     );
      //   },
      // },
    ],
    define: {
      'process.env.NODE_ENV': flags.watch ? '"development"' : '"production"',
    },
  });

  console.log('Build completed!');

  if (flags.watch) {
    console.log('Watching for changes...');
  } else {
    await stop();
  }
} catch (error) {
  console.error('Build failed:', error);
  Deno.exit(1);
}
