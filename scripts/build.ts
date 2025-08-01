import 'dotenv/config';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import plugin from 'bun-plugin-tailwind';
import chokidar from 'chokidar';
import { glob } from 'glob';

const args = process.argv.slice(2);
const flags = {
	watch: args.includes('--watch'),
	preview: args.includes('--preview'),
};

const root = process.cwd();

function ensureDirSync(dir: string) {
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}
}

ensureDirSync(path.join(root, 'static/js'));
// if (flags.preview) {
// 	ensureDirSync(path.join(root, 'dist/js'));
// 	ensureDirSync(path.join(root, 'dist/css'));
// }

async function buildNormal() {
	const entryPoints = glob
		.sync([
			'src/frontend/**/*.{ts,js,jsx,tsx}',
			'src/client/**/*.{ts,js,jsx,tsx}',
		])
		.map((file) => path.resolve(root, file));

	if (entryPoints.length > 0) {
		await Bun.build({
			entrypoints: entryPoints,
			outdir: path.join(root, 'static/js'),
			target: 'browser',
			plugins: [plugin],
			minify: !flags.watch,
			sourcemap: flags.watch ? 'linked' : 'none',
			env: 'inline',
			define: {},
		});
	}

	await Bun.build({
		entrypoints: [path.join(root, 'client.tsx')],
		outdir: path.join(root, 'static/js'),
		target: 'browser',
		minify: !flags.watch,
		plugins: [plugin],
		sourcemap: flags.watch ? 'linked' : 'none',
		env: 'inline',
		define: {},
	});
}

async function buildPreview() {
	await Bun.build({
		entrypoints: [path.join(root, 'preview.html')],
		outdir: path.join(root, 'dist'),
		target: 'browser',
		minify: true,
		sourcemap: 'none',
		env: 'inline',
		plugins: [plugin],
		define: {},
	});

	// copyFileSync(
	// 	path.join(root, 'static/ghostify.svg'),
	// 	path.join(root, 'dist/ghostify.svg'),
	// );
	// copyFileSync(
	// 	path.join(root, 'preview.html'),
	// 	path.join(root, 'dist/index.html'),
	// );
}

async function runBuild() {
	const start = performance.now();
	if (flags.preview) {
		await buildPreview();
	} else {
		await buildNormal();
	}
	const end = performance.now();
	const buildTime = (end - start).toFixed(2);
	console.log(`\n✅ Build completed in ${buildTime}ms\n`);
}

async function start() {
	await runBuild();

	if (flags.watch && !flags.preview) {
		console.log('👀 Watching for changes...');

		const watcher = chokidar.watch(
			[
				path.resolve(process.cwd(), './src'),
				path.resolve(process.cwd(), './client.tsx'),
			],
			{
				ignoreInitial: true,
				ignored: /node_modules/,
				persistent: true,
				awaitWriteFinish: true,
			},
		);

		watcher.on('all', async (event, filePath) => {
			console.log(`[${event}] ${filePath}`);
			try {
				await buildNormal();
				console.log('🔁 Rebuild successful');
			} catch (err) {
				console.error('❌ Rebuild failed:', err);
			}
		});
	} else {
		process.exit(0);
	}
}

start().catch((error) => {
	console.error('Build failed:', error);
	process.exit(1);
});
