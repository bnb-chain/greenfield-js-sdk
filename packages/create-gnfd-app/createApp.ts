import path from 'path';
import { green } from 'picocolors';
import { PackageManager } from './helpers/get-pkg-manager';
import { installTemplate, TemplateType } from './helpers/install-template';
import { isFolderEmpty } from './helpers/is-folder-empty';
import { isWriteable, makeDir } from './helpers/is-writeable';

export async function createApp({
  appPath,
  packageManager,
  template,
}: {
  appPath: string;
  packageManager: PackageManager;
  template: TemplateType;
}) {
  const root = path.resolve(appPath);
  if (!(await isWriteable(path.dirname(root)))) {
    /* eslint-disable-next-line no-console */
    console.error(
      `The application path is not writable, please check folder permissions and try again.
      It is likely you do not have write permissions for this folder.
      `,
    );
    process.exit(1);
  }

  const appName = path.basename(root);
  await makeDir(root);
  if (!isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  const originalDirectory = process.cwd();
  /* eslint-disable-next-line no-console */
  console.log(`Creating a new Greenfield app in ${green(root)}.`);
  process.chdir(root);
  const packageJsonPath = path.join(root, 'package.json');

  await installTemplate({
    appName,
    root,
    packageManager,
    isOnline: true,
    template,
    mode: 'ts',
  });
}
