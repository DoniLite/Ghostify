import { build, stop } from 'https://deno.land/x/esbuild@v0.20.1/mod.js';
import { denoPlugins } from 'https://deno.land/x/esbuild_deno_loader@0.9.0/mod.ts';
import { parseArgs } from 'https://deno.land/std@0.224.0/cli/parse_args.ts';
import { ensureDir } from 'https://deno.land/std@0.220.1/fs/ensure_dir.ts';
import { glob } from 'glob';
import path from 'node:path';

const flags = parseArgs(Deno.args, {
  boolean: ['watch'],
  default: { watch: false },
});

// Ensure build directory exists
await ensureDir(path.join(Deno.cwd(), '/static/js'));

try {
  const _result = await build({
    entryPoints: [
      ...glob
        .sync([
          './src/frontend/**/*.ts',
          './src/frontend/**/*.js',
          './src/frontend/**/*.jsx',
          './src/frontend/**/*.tsx',
          './src/client/**/*.js',
          './src/client/**/*.ts',
          './src/client/**/*.jsx',
          './src/client/**/*.tsx',
        ])
        .map((file) => path.resolve(Deno.cwd(), file)),
    ],
    bundle: true,
    minify: !flags.watch,
    sourcemap: flags.watch ? 'inline' : false,
    target: 'esnext',
    outdir: path.join(Deno.cwd(), '/static/js'),
    format: 'esm',
    jsx: 'automatic',
    jsxImportSource: 'hono/jsx/dom',
    platform: 'browser',
    loader: {
      '.ts': 'ts',
      '.tsx': 'tsx',
      '.js': 'js',
      '.jsx': 'jsx',
      '.json': 'json',
      '.css': 'css',
    },
    plugins: [
      ...denoPlugins({
        nodeModulesDir: true,
        configPath: path.join(Deno.cwd(), 'deno.json'),
        loader: 'portable',
        // importMapURL: `file://${path.join(Deno.cwd(), 'import_map.json')}`,
      }),
    ],
    define: {
      'process.env.DENO_ENV': flags.watch ? '"development"' : '"production"',
      'globalThis.IS_BROWSER': 'true',
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
