import { createPublicClient, createWalletClient, http, parseAbi, PrivateKeyAccount } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { bscTestnet } from 'viem/chains';
import { ExecutorABI } from '../abi/Executor.abi';
import { ExecuteParams } from '../types';
import { splitExecutorParams } from '../utils';

export default class ExecutorClient {
  account: PrivateKeyAccount;

  private publicClient = createPublicClient({
    chain: bscTestnet,
    transport: http(),
  });

  private walletClient = createWalletClient({
    chain: bscTestnet,
    transport: http(),
  });

  constructor(privateKey: `0x${string}`, public executorAddress: `0x${string}`) {
    this.account = privateKeyToAccount(privateKey);
    this.executorAddress = executorAddress;
  }

  async execute(
    params: ExecuteParams[],
    opts: {
      relayFee: bigint;
    },
  ) {
    if (params.length === 0) throw new Error('execute params is empty');

    const { types, bytes } = splitExecutorParams(params);
    const { relayFee } = opts;

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
