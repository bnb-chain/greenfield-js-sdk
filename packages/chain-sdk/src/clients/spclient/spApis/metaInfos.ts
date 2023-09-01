import { getBucketApprovalMetaInfo } from './bucketApproval';
import { getGetObjectMetaInfo } from './getObject';
import { getObjectApprovalMetaInfo } from './objectApproval';
import { getPutObjectMetaInfo } from './putObject';
import { getQueryBucketReadQuotaMetaInfo } from './queryBucketReadQuota';

export const SpMetaInfo = {
  getBucketApprovalMetaInfo,
  getGetObjectMetaInfo,
  getObjectApprovalMetaInfo,
  getPutObjectMetaInfo,
  getQueryBucketReadQuotaMetaInfo,
};
