import prompts from '@inquirer/prompts';
import Commander from 'commander';
import fs, { readFileSync } from 'fs';
import path, { resolve } from 'path';
import { cyan, green } from 'picocolors';
import validateNpmName from 'validate-npm-package-name';
import { createApp } from './createApp';
import { PackageManager } from './helpers/get-pkg-manager';
import { TemplateType } from './helpers/install-template';
import { isFolderEmpty } from './helpers/is-folder-empty';

const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'));
let projectPath = '';

const program = new Commander.Command(packageJson.name);
program
  .version(packageJson.version)
  .argument('[project-directory]')
  .usage(`${green('[project-directory]')} [options]`)
  .action((str) => {
    projectPath = str;
  })
  .allowUnknownOption()
  .parse(process.argv);

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
      { name: 'vite', value: 'vite' },
    ],
  });

  const packageManager: PackageManager = await prompts.select({
    message: 'select a package manager?',
    choices: [
      { name: 'npm', value: 'npm' },
      { name: 'yarn', value: 'yarn' },
      { name: 'pnpm', value: 'pnpm' },
    ],
  });

  const resolvedProjectPath = path.resolve(projectPath);
  const root = path.resolve(resolvedProjectPath);
  const appName = path.basename(root);
  const folderExists = fs.existsSync(root);

  if (folderExists && !isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  try {
    await createApp({
      appPath: resolvedProjectPath,
      packageManager,
      template,
    });
  } catch (reason) {
    // .
  }
}

runInitPrompts().catch(() => {
  // ignore error
});
