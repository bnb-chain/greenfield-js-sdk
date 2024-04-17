import fs from 'fs';

export async function isWriteable(directory: string): Promise<boolean> {
  try {
    await fs.promises.access(directory, (fs.constants || fs).W_OK);
    return true;
  } catch (err) {
    return false;
  }
}

export function makeDir(root: string, options = { recursive: true }): Promise<string | undefined> {
  return fs.promises.mkdir(root, options);
}
