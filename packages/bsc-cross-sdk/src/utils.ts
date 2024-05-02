import { Address } from 'viem';
import { ChainConfig, ExecuteParams, SendMessagesParams } from './types';
import { bsc, bscTestnet } from 'viem/chains';

export const getChain = (chainConfig: ChainConfig) => {
  return chainConfig === 'testnet' ? bscTestnet : bsc;
};

export const splitExecutorParams = (params: ExecuteParams[]) => {
  const types: number[] = [];
  const bytes: `0x${string}`[] = [];

  params.forEach((p) => {
    types.push(p[0]);
    bytes.push(p[1]);
  });

  return {
    types,
    bytes,
  };
};

export const splitMultiMessageParams = (params: SendMessagesParams[]) => {
  const targets: Address[] = [];
  const msgBytes: Address[] = [];
  const values: bigint[] = [];

  params.forEach((p) => {
    targets.push(p.target);
    msgBytes.push(p.msgBytes);
    values.push(p.values);
  });

  return {
    targets,
    msgBytes,
    values,
  };
};
