import { makeRpcClient } from '@/api/queryclient';
import {
  ServiceClientImpl,
  SimulateRequest,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/service';
import { AuthInfo, Tx, TxBody } from '@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/tx';
import { StargateClient } from '@cosmjs/stargate';
import { toBuffer } from '@ethereumjs/util';

export interface IBaseMsg {
  sequence: string;
  denom: string;
  accountNumber: string;
  gasLimit: number;
  gasPrice: string;
}

export interface ISendMsg {
  from: string;
  to: string;
  amount: string;
}

export interface IRawTxInfo {
  bytes: Uint8Array;
  hex: string;
}

export class BaseTx {
  readonly rpcUrl: string;
  readonly chainId: string;
  readonly txType: string;
  private static client: StargateClient;

  constructor(rpcUrl: string, chainId: string, txType: string) {
    this.rpcUrl = rpcUrl;
    this.chainId = chainId;
    this.txType = txType;
  }

  public async broadcastTx(txRawBytes: Uint8Array) {
    const client = await StargateClient.connect(this.rpcUrl);

    if (!BaseTx.client) {
      BaseTx.client = client;
    }

    return await client.broadcastTx(txRawBytes);
  }

  protected getSignture(sign: string) {
    return Uint8Array.from(toBuffer(sign));
  }

  public async simulateTx(txBodyBytes: Uint8Array, authInfoBytes: Uint8Array) {
    const rpcClient = await makeRpcClient(this.rpcUrl);
    const rpc = new ServiceClientImpl(rpcClient);

    const tx = Tx.fromPartial({
      authInfo: AuthInfo.decode(authInfoBytes),
      body: TxBody.decode(txBodyBytes),
      signatures: [Uint8Array.from([])],
    });

    const request = SimulateRequest.fromPartial({
      txBytes: Tx.encode(tx).finish(),
    });

    return rpc.Simulate(request);
  }
}
