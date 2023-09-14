/* eslint-disable no-console */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { bold, cyan } from 'picocolors';
import { copySync } from 'fs-extra';
import { PackageManager } from './get-pkg-manager';
import { install } from './install';
import { makeDir } from './is-writeable';

export const SRC_DIR_NAMES = ['app', 'pages', 'styles'];

export type TemplateType = 'nextjs' | 'cra';
export type TemplateMode = 'js' | 'ts';

export const installTemplate = async ({
  appName,
  root,
  packageManager,
  isOnline,
  template,
  mode,
}: InstallTemplateArgs) => {
  console.log(bold(`Using ${packageManager}.`));

  /**
   * Copy the template files to the target directory.
   */
  console.log('\nInitializing project with template:', template, '\n');
  const templatePath = path.join(__dirname, 'templates', template, mode);

  // console.log('root', root);
  // console.log('__dirname', __dirname);
  // console.log('templatePath', templatePath);

  // await copy(copySource, root, {
  //   parents: true,
  //   cwd: templatePath,
  //   rename(name) {
  //     switch (name) {
  //       case 'gitignore':
  //       case 'eslintrc.json': {
  //         return `.${name}`;
  //       }
  //       // README.md is ignored by webpack-asset-relocator-loader used by ncc:
  //       // https://github.com/vercel/webpack-asset-relocator-loader/blob/e9308683d47ff507253e37c9bcbb99474603192b/src/asset-relocator.js#L227
  //       case 'README-template.md': {
  //         return 'README.md';
  //       }
  //       default: {
  //         return name;
  //       }
  //     }
  //   },
  // });

  copySync(templatePath, root);

  // const tsconfigFile = path.join(root, mode === 'js' ? 'jsconfig.json' : 'tsconfig.json');
  /* await fs.promises.writeFile(
    tsconfigFile,
    (await fs.promises.readFile(tsconfigFile, 'utf8'))
      .replace(`"@/*": ["./*"]`, srcDir ? `"@/*": ["./src/*"]` : `"@/*": ["./*"]`)
      .replace(`"@/*":`, `"${importAlias}":`),
  ); */

  // update import alias in any files if not using the default

  // await makeDir(path.join(root, 'src'));
  await Promise.all(
    SRC_DIR_NAMES.map(async (file) => {
      await fs.promises.rename(path.join(root, file), path.join(root, 'src', file)).catch((err) => {
        if (err.code !== 'ENOENT') {
          throw err;
        }
      });
    }),
  );

  console.log('root', root);

  /**
   * Create a package.json for the new project and write it to disk.
   */
  const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      '@types/node': '20.6.0',
      '@types/react': '18.2.21',
      '@types/react-dom': '18.2.7',
      eslint: '8.49.0',
      'eslint-config-next': '13.4.19',
      next: '13.4.19',
      react: '18.2.0',
      'react-dom': '18.2.0',
      typescript: '5.2.2',
    },
  };
  await fs.promises.writeFile(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL,
  );

  /**
   * These flags will be passed to `install()`, which calls the package manager
   * install process.
   */
  const installFlags = { packageManager, isOnline };

  /**
   * Default dependencies.
   */
  // const dependencies = [
  //   'react',
  //   'react-dom',
  //   `next${
  //     process.env.NEXT_PRIVATE_TEST_VERSION ? `@${process.env.NEXT_PRIVATE_TEST_VERSION}` : ''
  //   }`,
  // ];

  /**
   * TypeScript projects will have type definitions and other devDependencies.
   */
  // if (mode === 'ts') {
  //   dependencies.push('typescript', '@types/react', '@types/node', '@types/react-dom');
  // }

  /**
   * Install package.json dependencies if they exist.
   */
  /* if (dependencies.length) {
    console.log();
    console.log('Installing dependencies:');
    for (const dependency of dependencies) {
      console.log(`- ${cyan(dependency)}`);
    }
    console.log();

    await install(root, dependencies, installFlags);
  } */
};

export interface InstallTemplateArgs {
  appName: string;
  root: string;
  packageManager: PackageManager;
  isOnline: boolean;
  template: TemplateType;
  mode: TemplateMode;
  // eslint: boolean;
  // tailwind: boolean;
  // srcDir: boolean;
  // importAlias: string;
}
