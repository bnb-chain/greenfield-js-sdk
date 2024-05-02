import { Address, parseAbi } from 'viem';
import { ExecutorABI } from '../../abi/Executor.abi';
import { BasicClient } from '../basic';
import { BasicClientParams, ExecuteParams } from '../../types';
import { splitExecutorParams } from '../../utils';

interface IExecutorClient {
  execute(
    params: ExecuteParams[],
    opts: {
      relayFee: bigint;
    },
  ): Promise<Address>;
}

export class ExecutorClient extends BasicClient implements IExecutorClient {
  constructor(initParams: BasicClientParams, public executorAddress: `0x${string}`) {
    super(initParams);
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
