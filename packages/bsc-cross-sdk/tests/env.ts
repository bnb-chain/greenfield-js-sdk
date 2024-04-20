import * as dotenv from 'dotenv';
dotenv.config({
  path: process.cwd() + '/tests/.env',
});

export const ACCOUNT_PRIVATEKEY = (process.env.ACCOUNT_PRIVATEKEY as `0x${string}`) || '0x';
export const ExecutorAddress = (process.env.EXECUTOR_ADDRESS as `0x${string}`) || '0x';
export const CrossChainAddress = (process.env.CROSSCHAIN_ADDRESS as `0x${string}`) || '0x';
export const MultiMessageAddress = (process.env.MULTIMESSAGE_ADDRESS as `0x${string}`) || '0x';
export const BucketHubAddress = (process.env.BUCKETHUB_ADDRESS as `0x${string}`) || '0x';
export const ObjectHubAddress = (process.env.OBJECTHUB_ADDRESS as `0x${string}`) || '0x';
export const TokenHubAddress = (process.env.TOKENHUB_ADDRESS as `0x${string}`) || '0x';
export const PermissionHubAddress = (process.env.PERMISSIONHUB_ADDRESS as `0x${string}`) || '0x';
export const GroupHubAddress = (process.env.GROUPHUB_ADDRESS as `0x${string}`) || '0x';
