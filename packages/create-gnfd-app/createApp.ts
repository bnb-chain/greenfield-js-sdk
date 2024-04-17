import download from 'download-git-repo';
import path from 'path';
import { green } from 'picocolors';
import { PackageManager } from './helpers/get-pkg-manager';
import { installTemplate, TemplateType } from './helpers/install-template';
import { isFolderEmpty } from './helpers/is-folder-empty';
import { isWriteable, makeDir } from './helpers/is-writeable';
import { failSpinner, startSpinner, succeedSpiner } from './helpers/spinner';
import { TEMPLATES_MAP } from './templates';

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

  /* eslint-disable-next-line no-console */
  console.log(`Creating a new Greenfield app in ${green(appName)}.`);
  process.chdir(root);

  startSpinner('downloading template...');
  download(TEMPLATES_MAP[template], '.', { clone: false }, (err) => {
    if (err) {
      failSpinner(err.message);
      return;
    }

    succeedSpiner(`download template - ${template} success`);

    return installTemplate({
      appName,
      root,
      packageManager,
    });
  }).then(() => {
    // ...
  });
}
