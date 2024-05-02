import { NodeFile, UploadFile } from '@/types/sp/Common';
import { AuthType } from '../..';

export const assertStringRequire = (s: string, errMsg: string) => {
  if (!s) throw new Error(errMsg);
};

export const assertPrivateKey = (privateKey: string) => {
  if (!privateKey.startsWith('0x')) throw new Error('private key should start with 0x');
};

export const assertAuthType = (authType: AuthType) => {
  if (!authType) throw new Error('authType is required');

  if (authType.type === 'ECDSA') {
    assertPrivateKey(authType.privateKey);
  }

  if (authType.type === 'EDDSA') {
    assertStringRequire(authType.address, 'address param is required');
    assertStringRequire(authType.seed, 'seed param is required');
    assertStringRequire(authType.domain, 'domain param is required');
  }
};

export function assertFileType(file: UploadFile): file is NodeFile {
  if ('content' in file) {
    return true;
  }

  return false;
}

export function assertHttpMethod(method?: string): asserts method is 'GET' | 'POST' | 'PUT' {
  if (method !== 'GET' && method !== 'POST' && method !== 'PUT')
    throw new Error('method should be GET, POST or PUT');
}
