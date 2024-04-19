import { createPublicClient, http, parseAbi } from 'viem';
import { bscTestnet } from 'viem/chains';
import { CrossChainABI } from '../abi/CrossChain.abi';

export default class CrossChainClient {
  private publicClient = createPublicClient({
    chain: bscTestnet,
    transport: http(),
  });

  constructor(public crossChainAddress: `0x${string}`) {}

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
      functionName: 'getRelayFees',
    });

    return data;
  }
}
