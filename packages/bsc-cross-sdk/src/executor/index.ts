import { createPublicClient, createWalletClient, http, parseAbi, PrivateKeyAccount } from 'viem';
import { bscTestnet } from 'viem/chains';
import { CrossChainABI } from '../../abi/CrossChain.abi';
import { privateKeyToAccount } from 'viem/accounts';
import { ExecutorABI } from '../../abi/Executor.abi';
import { ExecuteParams } from '../types';
import { splitParams } from './messages';

export default class ExecutorClient {
  account: PrivateKeyAccount;

  constructor(
    privateKey: `0x${string}`,
    public executorAddress: `0x${string}`,
    public crossChainAddress: `0x${string}`,
    private publicClient = createPublicClient({
      chain: bscTestnet,
      transport: http(),
    }),
    private walletClient = createWalletClient({
      chain: bscTestnet,
      transport: http(),
    }),
  ) {
    this.account = privateKeyToAccount(privateKey);
    this.executorAddress = executorAddress;
    this.crossChainAddress = crossChainAddress;
  }

  async getRelayFee(address: `0x${string}`) {
    const data = await this.publicClient.readContract({
      address,
      abi: parseAbi(CrossChainABI),
      functionName: 'getRelayFees',
    });

    return data[0];
  }

  async execute(params: ExecuteParams[]) {
    if (params.length === 0) throw new Error('execute params is empty');

    const { types, bytes } = splitParams(params);

    const relayFee = await this.getRelayFee(this.crossChainAddress);

    const { request } = await this.publicClient.simulateContract({
      account: this.account,
      address: this.executorAddress,
      abi: parseAbi(ExecutorABI),
      functionName: 'execute',
      args: [types, bytes],
      value: relayFee,
    });

    const txHash = await this.walletClient.writeContract(request);
    return txHash;
  }
}
