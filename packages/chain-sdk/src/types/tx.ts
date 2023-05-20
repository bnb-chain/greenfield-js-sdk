import { DeliverTxResponse } from '@cosmjs/stargate';

export interface ISimulateGasFee {
  gasLimit: bigint;
  gasPrice: string;
  gasFee: string;
}

export type SimulateOptions = {
  denom: string;
};

export type BroadcastOptions = {
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
} & SimulateOptions;

export type TxResponse = {
  simulate: (opts: SimulateOptions) => Promise<ISimulateGasFee>;
  broadcast: (opts: BroadcastOptions) => Promise<DeliverTxResponse>;
};
