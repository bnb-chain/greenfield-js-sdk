const IP_REGEX = /^(\d+\.){3}\d+$/g;
const ALLOW_REGEX = /^[a-z0-9][a-z0-9.\-]{1,61}[a-z0-9]$/g;
const dotdotComponent = '..';
const dotComponent = '.';
const slashSeparator = '/';

const isValidBucketName = (bucketName?: string) => {
  if (!bucketName) {
    throw new Error('Bucket name is empty, please check.');
  }
  const length = bucketName.length;
  if (length < 3 || length > 63) {
    throw new Error(`Bucket name length is required to be between 3~63, please check.`);
  }
  if (bucketName.match(IP_REGEX)) {
    throw new Error('The bucket name %s cannot be formatted as an IP address, please check.');
  }
  if (bucketName.includes('..') || bucketName.includes('.-') || bucketName.includes('-.')) {
    throw new Error('Bucket name contains invalid characters, please check.');
  }
  if (!bucketName.match(ALLOW_REGEX)) {
    throw new Error(
      'Bucket name can only include lowercase letters, numbers, commas and hyphen, please check.',
    );
  }
  if (
    bucketName[0] === '-' ||
    bucketName[length - 1] === '-' ||
    bucketName[0] === '.' ||
    bucketName[length - 1] === '.'
  ) {
    throw new Error(
      'Bucket name %must start and end with a lowercase letter or number, please check.',
    );
  }
  return true;
};

const hasBadPathComponent = (path: string): boolean => {
  const newPath = path.trim();
  for (const p of newPath.split(slashSeparator)) {
    switch (p.trim()) {
      case dotdotComponent:
      case dotComponent:
        return true;
    }
  }
  return false;
};

const isUTF8 = (str: string): boolean => {
  try {
    new TextDecoder('utf-8').decode(new TextEncoder().encode(str));
    return true;
  } catch {
    return false;
  }
};

const isValidObjectName = (objectName?: string) => {
  if (!objectName) {
    throw new Error('Object name is empty, please check.');
  }
  if (objectName.length > 1024) {
    throw new Error('Object name is limited to 1024 at most, please check.');
  }
  if (hasBadPathComponent(objectName)) {
    throw new Error('Object name error, please check.');
  }
  if (!isUTF8(objectName)) {
    throw new Error('Object name is not in UTF-8 format, please check.');
  }
  if (objectName.includes(`//`)) {
    throw new Error(`Object name that contains a "//" is not supported`);
  }

  return true;
};

const isValidAddress = (address?: string) => {
  if (!address) {
    throw new Error('Address is empty, please check.');
  }
  if (address.length > 1024) {
    throw new Error('Address is limited to 1024 at most, please check.');
  }
  return true;
};

const isValidUrl = (url?: string) => {
  if (!url || url.length === 0) return false;
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // 协议
      '((([a-zA-Z\\d]([a-zA-Z\\d-]{0,61}[a-zA-Z\\d])?)\\.)+' + // 域名
      '[a-zA-Z]{2,13})' + // 顶级域名
      '(\\:\\d{1,5})?' + // 端口号
      '(\\/[-a-zA-Z\\d%_.~+]*)*' + // 路径
      '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // 查询字符串
      '(\\#[-a-zA-Z\\d_]*)?$',
    'i',
  ); // 锚点
  return pattern.test(url);
};

// remove specified from prefix and suffix of a string
const trimString = (originString: string, deleteString: string) => {
  const delStrLength = deleteString.length;
  if (originString.startsWith(deleteString)) {
    originString = originString.substring(delStrLength);
  }
  if (originString.endsWith(deleteString)) {
    originString = originString.substring(0, originString.length - delStrLength);
  }
  return originString;
};

const generateUrlByBucketName = (endpoint = '', bucketName: string) => {
  if (!isValidUrl(endpoint)) {
    throw new Error('Invalid endpoint');
  }
  if (!isValidBucketName(bucketName)) {
    throw new Error('Error bucket name');
  }
  const { protocol } = new URL(endpoint);
  return endpoint.replace(`${protocol}//`, `${protocol}//${bucketName}.`);
};

export {
  isValidBucketName,
  isValidObjectName,
  isValidAddress,
  trimString,
  isValidUrl,
  generateUrlByBucketName,
};
