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
  /**
   * wallet extension sign data by EIP712
   */
  signTypedDataCallback?: (addr: string, eip712: string) => Promise<string>;
  simulate: boolean;
}
export type SimulateOrBroadResponse = ISimulateGasFee | DeliverTxResponse;
export type SimulateOrBroad<T extends ITxOption> = T['simulate'] extends true
  ? ISimulateGasFee
  : DeliverTxResponse;
