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

export type MetaTxInfo = {
  typeUrl: string;
  address: string;
  MsgSDKTypeEIP712: object;
  MsgSDK: object;
  msgBytes: Uint8Array;
  bodyBytes: Uint8Array;
};

export type TxResponse = {
  simulate: (opts: Readonly<SimulateOptions>) => Promise<ISimulateGasFee>;
  broadcast: (opts: Readonly<BroadcastOptions>) => Promise<DeliverTxResponse>;
  metaTxInfo: MetaTxInfo;
};

export type CustomTx = {
  /**
   * account
   */
  address: string;
  /**
   * txRaw infomation (hex string)
   */
  txRawHex: string;
  /**
   * EIP712 structure
   */
  eip712MsgType: object;
  /**
   * tx message
   */
  msgData: object;
};
