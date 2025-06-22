import { copyFileSync, existsSync, mkdirSync } from 'fs'
import fs from 'fs/promises'
import { glob } from 'glob'
import path from 'path'

// Parse CLI args
const args = process.argv.slice(2)
const flags = {
  watch: args.includes('--watch'),
  preview: args.includes('--preview')
}

// Ensure build directories exist
function ensureDirSync(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

const root = process.cwd()
ensureDirSync(path.join(root, 'static/js'))
if (flags.preview) {
  ensureDirSync(path.join(root, 'dist/js'))
  ensureDirSync(path.join(root, 'dist/css'))
}

const env = {
  WEBSOCKET_BASE_URL:
    process.env.WEBSOCKET_BASE_URL || 'ws://localhost:8787/ws/document/',
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8787/api'
}

async function runBuild() {
  if (!flags.preview) {
    // Normal build
    const entryPoints = glob
      .sync([
        '../src/frontend/**/*.{ts,js,jsx,tsx}',
        '../src/client/**/*.{ts,js,jsx,tsx}'
      ])
      .map((file) => path.resolve(root, file))

    if (entryPoints.length > 0) {
      await Bun.build({
        entrypoints: entryPoints,
        outdir: path.join(root, 'static/js'),
        target: 'browser',
        minify: !flags.watch,
        sourcemap: flags.watch ? 'inline' : 'none',
        define: {
          'process.env.DENO_ENV': flags.watch
            ? '"development"'
            : '"production"',
          'globalThis.IS_BROWSER': 'true'
        }
      })
    }

    await Bun.build({
      entrypoints: [path.join(root, 'client.tsx')],
      outdir: path.join(root, 'static/js'),
      target: 'browser',
      minify: !flags.watch,
      sourcemap: flags.watch ? 'inline' : 'none',
      define: {
        'process.env.DENO_ENV': flags.watch ? '"development"' : '"production"',
        'window.IS_BROWSER': 'true',
        'window.__ENV': JSON.stringify(env)
      }
    })
  } else {
    // Preview build
    await Bun.build({
      entrypoints: [path.join(root, 'client.preview.tsx')],
      outdir: path.join(root, 'dist/js'),
      target: 'browser',
      minify: true,
      sourcemap: false,
      define: {
        'process.env.DENO_ENV': '"production"',
        'window.IS_BROWSER': 'true',
        'window.__ENV': JSON.stringify(env)
      }
    })

    // Copy static assets
    await fs.cp(path.join(root, 'static/css'), path.join(root, 'dist/css'), {
      recursive: true
    })
    copyFileSync(
      path.join(root, 'static/ghostify.svg'),
      path.join(root, 'dist/ghostify.svg')
    )
    copyFileSync(
      path.join(root, 'preview.html'),
      path.join(root, 'dist/index.html')
    )
  }

  console.log('Build completed!')
  if (flags.watch) {
    console.log('Watching for changes... (not implemented)')
  } else {
    process.exit(0)
  }
}

runBuild().catch((error) => {
  console.error('Build failed:', error)
  process.exit(1)
})
