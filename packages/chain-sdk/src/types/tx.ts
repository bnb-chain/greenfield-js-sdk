import { DeliverTxResponse } from '@cosmjs/stargate';

export interface ISimulateGasFee {
  gasLimit: bigint;
  gasPrice: string;
  gasFee: string;
}
export interface ITxOption {
  denom: string;
  gasLimit: number;
  gasPrice: string;
  payer: string;
  granter: string;
  /**
   * 0x prefix suffix
   */
  privateKey?: string;
  simulate: boolean;
}
export type SimulateOrBroadResponse = ISimulateGasFee | DeliverTxResponse;
export type SimulateOrBroad<T extends ITxOption> = T['simulate'] extends true
  ? ISimulateGasFee
  : DeliverTxResponse;
