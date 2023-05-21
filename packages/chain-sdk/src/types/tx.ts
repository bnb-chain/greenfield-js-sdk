import { DeliverTxResponse } from '@cosmjs/stargate';

export interface ISimulateGasFee {
  gasLimit: bigint;
  gasPrice: string;
  gasFee: string;
}

export type SignOptions = {
  /**
   * 0x prefix suffix
   */
  privateKey: string;
  /**
   * wallet extension sign data by EIP712
   */
  signTypedDataCallback: (addr: string, eip712: string) => Promise<string>;
};

export type TxOptions = {
  gasLimit: number;
  gasPrice: string;
  payer: string;
  granter: string;
};

export type SimulateOptions = {
  denom: string;
};

export type BroadcastOptions = TxOptions & SimulateOptions & Partial<SignOptions>;

export type TxResponse = {
  simulate: (opts: Readonly<SimulateOptions>) => Promise<ISimulateGasFee>;
  broadcast: (opts: Readonly<BroadcastOptions>) => Promise<DeliverTxResponse>;
};
