import spawn from 'cross-spawn';
import fs from 'fs';
import { removeSync } from 'fs-extra';
import handlebars from 'handlebars';
import { cyan } from 'picocolors';
import { PackageManager } from './get-pkg-manager';
import { failSpinner, startSpinner, succeedSpiner } from './spinner';

export const SRC_DIR_NAMES = ['app', 'pages', 'styles'];

export type TemplateType = 'nextjs' | 'cra' | 'vite';
export type TemplateMode = 'js' | 'ts';

export const installTemplate = async ({ appName, root, packageManager }: InstallTemplateArgs) => {
  /**
   * Create a package.json for the new project and write it to disk.
   */
  const packageJsonPath = `${root}/package.json`;
  const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
  const packageJsonResult = handlebars.compile(packageJsonContent)({
    name: appName,
  });
  fs.writeFileSync(packageJsonPath, packageJsonResult);

  /**
   * delete package-lock.json
   */
  removeSync(`${root}/package-lock.json`);

  /**
   * install dependencies
   */
  startSpinner(cyan(`Installing dependencies with ${packageManager}...`));
  const child = spawn(packageManager, ['install'], {
    // stdio: 'inherit',
    // env: {
    //   ...process.env,
    //   ADBLOCK: '1',
    //   NODE_ENV: 'development',
    //   DISABLE_OPENCOLLECTIVE: '1',
    // },
  });

  child.on('close', (code) => {
    if (code !== 0) {
      failSpinner('Failed to install dependencies.');
      return;
    }

    succeedSpiner('Install dependencies successfully.');
  });
};

export interface InstallTemplateArgs {
  appName: string;
  root: string;
  packageManager: PackageManager;
}
