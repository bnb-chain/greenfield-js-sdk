import prompts from '@inquirer/prompts';
import Commander from 'commander';
import fs, { readFileSync } from 'fs';
import path, { resolve } from 'path';
import { cyan, green } from 'picocolors';
import validateNpmName from 'validate-npm-package-name';
import { createApp } from './createApp';
import { getPkgManager, PackageManager } from './helpers/get-pkg-manager';
import { TemplateType } from './helpers/install-template';
import { isFolderEmpty } from './helpers/is-folder-empty';

const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'));
let projectPath = '';
// const projectName = 'xxx';

const program = new Commander.Command(packageJson.name);
program
  .version(packageJson.version)
  .argument('[project-directory]')
  .usage(`${green('[project-directory]')} [options]`)
  .action((str) => {
    projectPath = str;
  })
  // .option('-n, --name <string>', "What's your app name?")
  // .option('-i, --integer <n>', 'An integer argument', parseInt)
  .option(
    '--ts, --typescript',
    `
      Initialize as a Typescript project(default)
    `,
  )
  .option('--use-npm', `Explicitly tell the CLI to bootstrap the application using npm`)
  .option('--use-yarn', `Explicitly tell the CLI to bootstrap the application using npm`)
  .option('--use-pnpm', `Explicitly tell the CLI to bootstrap the application using npm`)
  .allowUnknownOption()
  .parse(process.argv);

const { useYarn, useNpm, usePnpm } = program.opts();
const packageManager: PackageManager = !!useNpm
  ? 'npm'
  : !!usePnpm
  ? 'pnpm'
  : !!useYarn
  ? 'yarn'
  : getPkgManager();

// console.log('packageManager', packageManager);
// console.log('projectPath', projectPath);
// console.log(program.name());
// console.log(program.opts());

async function runInitPrompts(): Promise<void> {
  if (!projectPath) {
    projectPath = await prompts.input({
      message: 'What is your project named?',
      validate: (val) => {
        const { validForNewPackages } = validateNpmName(val);
        if (!validForNewPackages) {
          return 'Invalid NPM name';
        }
        return true;
      },
    });

    projectPath = projectPath.trim();
  }

  if (!projectPath) {
    /* eslint-disable-next-line no-console */
    console.log(
      '\nPlease specify the project directory:\n' +
        `  ${cyan(program.name())} ${green('<project-directory>')}\n` +
        'For example:\n' +
        `  ${cyan(program.name())} ${green('my-next-app')}\n\n` +
        `Run ${cyan(`${program.name()} --help`)} to see all options.`,
    );
    process.exit(1);
  }

  const template: TemplateType = await prompts.select({
    message: 'select a template?',
    choices: [
      { name: 'nextjs', value: 'nextjs' },
      { name: 'create-react-app', value: 'cra' },
    ],
  });

  // console.log('template', template);

  const resolvedProjectPath = path.resolve(projectPath);
  // const projectName = path.basename(resolvedProjectPath);

  const root = path.resolve(resolvedProjectPath);
  // console.log('root', root);

  // console.log('resolvedProjectPath', resolvedProjectPath);
  // console.log('projectName', projectName);

  const appName = path.basename(root);
  const folderExists = fs.existsSync(root);

  // console.log('appName', appName);
  // console.log('folderExists', folderExists);

  if (folderExists && !isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  try {
    await createApp({
      appPath: resolvedProjectPath,
      packageManager,
      template,
      // example: example && example !== 'default' ? example : undefined,
      // examplePath: program.examplePath,
      // typescript: program.typescript,
      // tailwind: program.tailwind,
      // eslint: program.eslint,
      // appRouter: program.app,
      // srcDir: program.srcDir,
      // importAlias: program.importAlias,
    });
  } catch (reason) {
    // .
  }
}

runInitPrompts().catch(() => {
  // ignore error
});
