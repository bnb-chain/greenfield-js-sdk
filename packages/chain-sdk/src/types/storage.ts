export interface IBaseUser {
  address: string;
  domain: string;
}
export interface ISp {
  address: string;
  endpoint: string;
  name?: string;
  nonce?: number;
}

export interface IFetchNonces extends IBaseUser {
  sps: ISp[];
}

export interface IGenOffChainAuthKeyPairAndUpload extends IBaseUser {
  sps: ISp[];
  chainId: number;
  expirationMs: number;
}

export interface IReturnOffChainAuthKeyPairAndUpload {
  seedString: string;
  pubKey: string;
  expirationTime: number;
  spAddresses: string[];
  failedSpAddresses: string[];
}

export interface IReturnSignWithSeedString {
  unSignedMsg: string;
  signature: string;
  authorization: string;
}

export interface TGenSecondSignMsgParams {
  domain: string;
  address: string;
  pubKey: string;
  chainId: number;
  issuedDate: string;
  expireDate: string;
  sps: ISp[];
}

export interface IUpdateOneSpPubKeyBaseParams {
  address: string;
  domain: string;
  pubKey: string;
  expireDate: string;
  authorization: string;
}

export interface IUpdateOneSpPubKeyParams extends IUpdateOneSpPubKeyBaseParams {
  sp: ISp;
}
export interface IUpdateSpsPubKeyParams extends IUpdateOneSpPubKeyBaseParams {
  sps: ISp[];
}

export interface IPersonalSignParams {
  message: string;
  address: string;
  provider: any;
}

export interface TGetCurrentSeedStringParams {
  message: string;
  address: string;
  chainId: number;
  provider: any;
}
