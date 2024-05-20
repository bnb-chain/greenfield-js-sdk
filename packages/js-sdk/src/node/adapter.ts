import fs from 'node:fs';
import path from 'node:path';
import mimeTypes from 'mime-types';
import { NodeFile } from '@/types/sp/Common';

export function createFile(filePath: string): NodeFile {
  const stats = fs.statSync(filePath);
  const fileSize = stats.size;

  const extname = path.extname(filePath);
  const type = mimeTypes.lookup(extname);

  if (!type) throw new Error(`Unsupported file type: ${filePath}`);

  // console.log('fs.readFileSync(filePath)', fs.readFileSync(filePath));

  return {
    name: filePath,
    // type: 'application/octet-stream',
    type,
    size: fileSize,
    content: fs.readFileSync(filePath),
  };
}
