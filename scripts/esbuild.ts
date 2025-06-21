import { glob } from 'glob'
import { copy, ensureDir } from 'https://deno.land/std@0.220.1/fs/mod.ts'
import { parseArgs } from 'https://deno.land/std@0.224.0/cli/parse_args.ts'
import { build } from 'https://deno.land/x/esbuild@v0.20.1/mod.js'
import { denoPlugins } from 'https://deno.land/x/esbuild_deno_loader@0.9.0/mod.ts'
import path from 'node:path'

const flags = parseArgs(Deno.args, {
  boolean: ['watch', 'preview'],
  default: { watch: false, preview: false }
})

// Ensure build directories exist
await ensureDir(path.join(Deno.cwd(), '/static/js'))
if (flags.preview) {
  await ensureDir(path.join(Deno.cwd(), '/dist/js'))
  await ensureDir(path.join(Deno.cwd(), '/dist/css'))
}

const env = {
  WEBSOCKET_BASE_URL: Deno.env.get('WEBSOCKET_BASE_URL') || 'ws://localhost:8787/ws/document/',
  API_BASE_URL: Deno.env.get('API_BASE_URL') || 'http://localhost:8787/api'
}

try {
  if (!flags.preview) {
    // Normal build process for the application
    await build({
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
            './src/client/**/*.tsx'
          ])
          .map((file) => path.resolve(Deno.cwd(), file))
      ],
      bundle: true,
      minify: !flags.watch,
      sourcemap: flags.watch ? 'inline' : false,
      target: 'esnext',
      outdir: path.join(Deno.cwd(), '/static/js'),
      format: 'esm',
      jsx: 'automatic',
      jsxImportSource: 'react',
      platform: 'browser',
      loader: {
        '.ts': 'ts',
        '.tsx': 'tsx',
        '.js': 'js',
        '.jsx': 'jsx',
        '.json': 'json',
        '.css': 'css'
      },
      plugins: [
        ...denoPlugins({
          nodeModulesDir: true,
          configPath: path.join(Deno.cwd(), 'deno.json'),
          loader: 'portable'
          // importMapURL: `file://${path.join(Deno.cwd(), 'import_map.json')}`,
        })
      ],
      define: {
        'process.env.DENO_ENV': flags.watch ? '"development"' : '"production"',
        'globalThis.IS_BROWSER': 'true'
      }
    })

    await build({
      entryPoints: ['./client.tsx'],
      bundle: true,
      minify: !flags.watch,
      sourcemap: flags.watch ? 'inline' : false,
      target: 'esnext',
      outdir: path.join(Deno.cwd(), '/static/js'),
      format: 'esm',
      jsx: 'automatic',
      jsxImportSource: 'react',
      platform: 'browser',
      loader: {
        '.ts': 'ts',
        '.tsx': 'tsx',
        '.js': 'js',
        '.jsx': 'jsx',
        '.json': 'json',
        '.css': 'css'
      },
      plugins: [
        ...denoPlugins({
          nodeModulesDir: true,
          configPath: path.join(Deno.cwd(), 'deno.json'),
          loader: 'portable'
          // importMapURL: `file://${path.join(Deno.cwd(), 'import_map.json')}`,
        })
      ],
      define: {
        'process.env.DENO_ENV': flags.watch ? '"development"' : '"production"',
        'window.IS_BROWSER': 'true',
        'window.__ENV': JSON.stringify(env)
      }
    })
  } else {
    // Preview build process
    await build({
      entryPoints: ['./client.preview.tsx'],
      bundle: true,
      minify: true,
      sourcemap: false,
      target: 'esnext',
      outdir: path.join(Deno.cwd(), '/dist/js'),
      format: 'esm',
      jsx: 'automatic',
      jsxImportSource: 'react',
      platform: 'browser',
      loader: {
        '.ts': 'ts',
        '.tsx': 'tsx',
        '.js': 'js',
        '.jsx': 'jsx',
        '.json': 'json',
        '.css': 'css'
      },
      plugins: [
        ...denoPlugins({
          nodeModulesDir: true,
          configPath: path.join(Deno.cwd(), 'deno.json'),
          loader: 'portable'
        })
      ],
      define: {
        'process.env.DENO_ENV': '"production"',
        'window.IS_BROWSER': 'true',
        'window.__ENV': JSON.stringify(env)
      }
    })

    // Copy static assets to dist
    await copy(path.join(Deno.cwd(), '/static/css'), path.join(Deno.cwd(), '/dist/css'), {
      overwrite: true
    })

    await copy(
      path.join(Deno.cwd(), '/static/ghostify.svg'),
      path.join(Deno.cwd(), '/dist/ghostify.svg'),
      { overwrite: true }
    )

    await copy(path.join(Deno.cwd(), '/preview.html'), path.join(Deno.cwd(), '/dist/index.html'), {
      overwrite: true
    })
  }

  console.log('Build completed!')

  if (flags.watch) {
    console.log('Watching for changes...')
  } else {
    Deno.exit(0)
  }
} catch (error) {
  console.error('Build failed:', error)
  Deno.exit(1)
}
