import type { ReqMeta } from '@/types';
import { getBucketApprovalMetaInfo } from './bucketApproval';
import { getGetObjectMetaInfo } from './getObject';
import { getObjectApprovalMetaInfo } from './objectApproval';
import { getPutObjectMetaInfo } from './putObject';
import { getQueryBucketReadQuotaMetaInfo } from './queryBucketReadQuota';

export type SPMetaInfo = {
  url: string;
  optionsWithOutHeaders: Omit<RequestInit, 'headers'>;
  reqMeta: Partial<ReqMeta>;
};

export const SpMetaInfo = {
  getBucketApprovalMetaInfo,
  getGetObjectMetaInfo,
  getObjectApprovalMetaInfo,
  getPutObjectMetaInfo,
  getQueryBucketReadQuotaMetaInfo,
};
