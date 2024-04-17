import { createPublicClient, http, parseAbi } from 'viem';
import { bscTestnet } from 'viem/chains';
import { CrossChainABI } from '../../abi/CrossChain.abi';

export default class ExecutorClient {
  constructor(
    public publicClient = createPublicClient({
      chain: bscTestnet,
      transport: http(),
    }),
  ) {}

  async getRelayFee(address: `0x${string}`) {
    const data = await this.publicClient.readContract({
      address,
      abi: parseAbi(CrossChainABI),
      functionName: 'getRelayFees',
    });

    return data[0];
  }

  // async execute() {}
}
