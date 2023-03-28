export interface ISignature712 {
  signature: string;
  messageHash: Uint8Array;
}

export { sign712Tx } from './signTx';
export { makeCosmsPubKey, recoverPk } from './pubKey';
