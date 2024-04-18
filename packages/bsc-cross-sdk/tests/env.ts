import dotenv from 'dotenv';
dotenv.config({
  path: process.cwd() + '/tests/.env',
});

export const ACCOUNT_PRIVATEKEY = (process.env.ACCOUNT_PRIVATEKEY as `0x${string}`) || '0x';
export const ExecutorAddress = (process.env.EXECUTOR_ADDRESS as `0x${string}`) || '0x';
export const CrossChainAddress = (process.env.CROSSCHAIN_ADDRESS as `0x${string}`) || '0x';
export const MultiMessageAddress = (process.env.MULTIMESSAGE_ADDRESS as `0x${string}`) || '0x';
