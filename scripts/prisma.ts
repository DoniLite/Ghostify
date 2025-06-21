// scripts/db/prisma.ts
import { Command } from 'https://deno.land/x/cliffy@v1.0.0-rc.4/command/mod.ts'

async function runPrismaCommand(command: string[]) {
  const process = new Deno.Command('npx', {
    args: ['prisma', ...command],
    stdout: 'piped',
    stderr: 'piped'
  })

  const { code, stdout, stderr } = await process.output()

  const outStr = new TextDecoder().decode(stdout)
  const errStr = new TextDecoder().decode(stderr)

  console.log(outStr)
  if (errStr) console.error(errStr)

  return code
}

await new Command()
  .name('prisma')
  .description('Prisma CLI wrapper for Deno')
  .command('generate', 'Generate Prisma Client')
  .action(async () => {
    await runPrismaCommand(['generate'])
  })
  .command('migrate-dev', 'Run development migrations')
  .option('-n, --name <name:string>', 'Name for the migration')
  .action(async ({ name }) => {
    const args = ['migrate', 'dev']
    if (name) args.push('--name', name)
    await runPrismaCommand(args)
  })
  .command('migrate-deploy', 'Deploy migrations to production')
  .action(async () => {
    await runPrismaCommand(['migrate', 'deploy'])
  })
  .command('db-pull', 'Pull database schema')
  .action(async () => {
    await runPrismaCommand(['db', 'pull'])
  })
  .command('db-push', 'Push schema to database')
  .action(async () => {
    await runPrismaCommand(['db', 'push'])
  })
  .command('migrate-reset', 'Reset database')
  .action(async () => {
    await runPrismaCommand(['migrate', 'reset'])
  })
  .parse(Deno.args)
