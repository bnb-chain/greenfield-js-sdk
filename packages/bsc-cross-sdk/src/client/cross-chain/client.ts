import { parseAbi } from 'viem';
import { CrossChainABI } from '../../abi/CrossChain.abi';
import { BasicClientParams } from '../../types';
import { BasicClient } from '../basic';

interface ICrossChainClient {
  getRelayFee(): Promise<{
    relayFee: bigint;
    minAckRelayFee: bigint;
  }>;

  getCallbackGasPrice(): Promise<bigint>;
}

export class CrossChainClient extends BasicClient implements ICrossChainClient {
  constructor(initParams: BasicClientParams, public crossChainAddress: `0x${string}`) {
    super(initParams);
  }

  async getRelayFee() {
    const data = await this.publicClient.readContract({
      address: this.crossChainAddress,
      abi: parseAbi(CrossChainABI),
      functionName: 'getRelayFees',
    });

    return {
      relayFee: data[0],
      minAckRelayFee: data[1],
    };
  }

  async getCallbackGasPrice() {
    const data = await this.publicClient.readContract({
      address: this.crossChainAddress,
      abi: parseAbi(CrossChainABI),
      functionName: 'callbackGasPrice',
    });

    return data as bigint;
  }
}
