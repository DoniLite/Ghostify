// scripts/db/prisma.ts

function printHelp() {
	console.log(`
Usage: bun prisma.ts <command> [options]

Commands:
  generate                 Generate Prisma Client
  migrate-dev [--name]     Run development migrations (optionally specify --name)
  migrate-deploy           Deploy migrations to production
  db-pull                  Pull database schema
  db-push                  Push schema to database
  migrate-reset            Reset database

Options:
  --name <name>            Name for the migration (only for migrate-dev)
  --help                   Show this help message
`);
}

async function runPrismaCommand(command: string[]) {
	const proc = Bun.spawn(['npx', 'prisma', ...command], {
		stdout: 'pipe',
		stderr: 'pipe',
	});

	const [stdout, stderr] = await Promise.all([
		new Response(proc.stdout).text(),
		new Response(proc.stderr).text(),
	]);

	if (stdout) console.log(stdout);
	if (stderr) console.error(stderr);

	return await proc.exited;
}

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help')) {
	printHelp();
	process.exit(0);
}

const [cmd, ...rest] = args;

switch (cmd) {
	case 'generate':
		await runPrismaCommand(['generate']);
		break;
	case 'migrate-dev': {
		const nameIdx = rest.indexOf('--name');
		const name = nameIdx !== -1 ? rest[nameIdx + 1] : undefined;
		const prismaArgs = ['migrate', 'dev'];
		if (name) prismaArgs.push('--name', name);
		await runPrismaCommand(prismaArgs);
		break;
	}
	case 'migrate-deploy':
		await runPrismaCommand(['migrate', 'deploy']);
		break;
	case 'db-pull':
		await runPrismaCommand(['db', 'pull']);
		break;
	case 'db-push':
		await runPrismaCommand(['db', 'push']);
		break;
	case 'migrate-reset':
		await runPrismaCommand(['migrate', 'reset']);
		break;
	default:
		console.error(`Unknown command: ${cmd}`);
		printHelp();
		process.exit(1);
}
