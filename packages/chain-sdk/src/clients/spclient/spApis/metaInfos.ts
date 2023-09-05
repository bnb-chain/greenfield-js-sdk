import type { ReqMeta } from '@/types';
import { getGetObjectMetaInfo } from './getObject';
import { getPutObjectMetaInfo } from './putObject';
import { getQueryBucketReadQuotaMetaInfo } from './queryBucketReadQuota';

export type SPMetaInfo = {
  url: string;
  optionsWithOutHeaders: Omit<RequestInit, 'headers'>;
  reqMeta: Partial<ReqMeta>;
};

export const SpMetaInfo = {
  getGetObjectMetaInfo,
  getPutObjectMetaInfo,
  getQueryBucketReadQuotaMetaInfo,
};
