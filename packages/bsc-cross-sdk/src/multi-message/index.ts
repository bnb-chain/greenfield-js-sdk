import { Policy } from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/types';
import {
  Address,
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  http,
  parseAbi,
  PrivateKeyAccount,
  toHex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { bscTestnet } from 'viem/chains';
import { BucketHubAbi } from '../abi/BucketHub.abi';
import { GroupHubAbi } from '../abi/GroupHub.abi';
import { MultiMessageAbi } from '../abi/MultiMessage.abi';
import { ObjectHubAbi } from '../abi/ObjectHub.abi';
import { PermissionHubAbi } from '../abi/PermissionHub.abi';
import {
  CreateBucketSynPackage,
  CreateGroupSynPackage,
  DeleteBucketSynPackage,
  DeleteGroupSynPackage,
  DeleteObjectSynPackage,
  DeletePolicySynPackage,
  MultiMessageClientInitParams,
  MultiMessageParamOptions,
  SendMessagesParams,
  TransferOutSynPackage,
  UpdateGroupSynPackage,
} from '../types';
import { splitMultiMessageParams } from '../utils';
import { assertAddress, assertBucketHubAddress } from './asserts';
import { TokenHubAbi } from '../abi/TokenHub.abi';

interface IMultiMessageClient {
  createBucket(synPkg: CreateBucketSynPackage, opts: MultiMessageParamOptions): SendMessagesParams;

  deleteBucket(synPkg: DeleteBucketSynPackage, opts: MultiMessageParamOptions): SendMessagesParams;

  deleteObject(synPkg: DeleteObjectSynPackage, opts: MultiMessageParamOptions): SendMessagesParams;

  createGroup(synPkg: CreateGroupSynPackage, opts: MultiMessageParamOptions): SendMessagesParams;

  deleteGroup(synPkg: DeleteGroupSynPackage, opts: MultiMessageParamOptions): SendMessagesParams;

  updateGroup(synPkg: UpdateGroupSynPackage, opts: MultiMessageParamOptions): SendMessagesParams;

  createPolicy(msg: Policy, opts: MultiMessageParamOptions): SendMessagesParams;

  deletePolicy(synPkg: DeletePolicySynPackage, opts: MultiMessageParamOptions): SendMessagesParams;

  transferOut(synPkg: TransferOutSynPackage, opts: MultiMessageParamOptions): SendMessagesParams;

  sendMessages(params: SendMessagesParams[]): Promise<Address>;
}

export default class MultiMessageClient implements IMultiMessageClient {
  account: PrivateKeyAccount;

  constructor(
    privateKey: `0x${string}`,
    public multiMsgAddress: `0x${string}`,
    public hubAddress: MultiMessageClientInitParams,
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
    this.multiMsgAddress = multiMsgAddress;
    this.hubAddress = hubAddress;
  }

  transferOut(synPkg: TransferOutSynPackage, opts: MultiMessageParamOptions): SendMessagesParams {
    assertBucketHubAddress(this.hubAddress.tokenHubAddress);

    const fee = opts.relayFee + opts.minAckRelayFee + synPkg.amount;
    return {
      target: this.hubAddress.tokenHubAddress,
      msgBytes: encodeFunctionData({
        abi: parseAbi(TokenHubAbi),
        functionName: 'prepareTransferOut',
        args: [opts.sender, synPkg.recipient, synPkg.amount],
      }),
      values: fee,
    };
  }

  updateGroup(synPkg: UpdateGroupSynPackage, opts: MultiMessageParamOptions): SendMessagesParams {
    assertBucketHubAddress(this.hubAddress.groupHubAddress);

    const fee = opts.relayFee + opts.minAckRelayFee;
    return {
      target: this.hubAddress.groupHubAddress,
      msgBytes: encodeFunctionData({
        abi: GroupHubAbi,
        functionName: 'prepareUpdateGroup',
        args: [opts.sender, synPkg],
      }),
      values: fee,
    };
  }

  createGroup(synPkg: CreateGroupSynPackage, opts: MultiMessageParamOptions): SendMessagesParams {
    assertBucketHubAddress(this.hubAddress.groupHubAddress);

    const fee = opts.relayFee + opts.minAckRelayFee;
    return {
      target: this.hubAddress.groupHubAddress,
      msgBytes: encodeFunctionData({
        abi: GroupHubAbi,
        functionName: 'prepareCreateGroup',
        args: [opts.sender, synPkg.owner, synPkg.name],
      }),
      values: fee,
    };
  }

  deleteGroup(synPkg: DeleteGroupSynPackage, opts: MultiMessageParamOptions): SendMessagesParams {
    assertBucketHubAddress(this.hubAddress.groupHubAddress);

    const fee = opts.relayFee + opts.minAckRelayFee;
    return {
      target: this.hubAddress.groupHubAddress,
      msgBytes: encodeFunctionData({
        abi: GroupHubAbi,
        functionName: 'prepareDeleteGroup',
        args: [opts.sender, synPkg.id],
      }),
      values: fee,
    };
  }

  createBucket(synPkg: CreateBucketSynPackage, opts: MultiMessageParamOptions): SendMessagesParams {
    assertBucketHubAddress(this.hubAddress.bucketHubAddress);
    assertAddress(synPkg.creator);
    assertAddress(synPkg.primarySpAddress);

    const fee = opts.relayFee + opts.minAckRelayFee;
    return {
      target: this.hubAddress.bucketHubAddress,
      msgBytes: encodeFunctionData({
        abi: BucketHubAbi,
        functionName: 'prepareCreateBucket',
        args: [opts.sender, synPkg],
      }),
      values: fee,
    };
  }

  deleteBucket(synPkg: DeleteBucketSynPackage, opts: MultiMessageParamOptions): SendMessagesParams {
    assertBucketHubAddress(this.hubAddress.bucketHubAddress);

    const fee = opts.relayFee + opts.minAckRelayFee;
    return {
      target: this.hubAddress.bucketHubAddress,
      msgBytes: encodeFunctionData({
        abi: BucketHubAbi,
        functionName: 'prepareDeleteBucket',
        args: [opts.sender, synPkg.id],
      }),
      values: fee,
    };
  }

  deleteObject(synPkg: DeleteObjectSynPackage, opts: MultiMessageParamOptions): SendMessagesParams {
    assertBucketHubAddress(this.hubAddress.objectHubAddress);

    const fee = opts.relayFee + opts.minAckRelayFee;
    return {
      target: this.hubAddress.objectHubAddress,
      msgBytes: encodeFunctionData({
        abi: ObjectHubAbi,
        functionName: 'prepareDeleteObject',
        args: [opts.sender, synPkg.id],
      }),
      values: fee,
    };
  }

  createPolicy(msg: Policy, opts: MultiMessageParamOptions) {
    assertBucketHubAddress(this.hubAddress.permissionHubAddress);

    const data = toHex(Policy.encode(msg).finish());

    const fee = opts.relayFee + opts.minAckRelayFee;
    return {
      target: this.hubAddress.permissionHubAddress,
      msgBytes: encodeFunctionData({
        abi: PermissionHubAbi,
        functionName: 'prepareCreatePolicy',
        args: [opts.sender, data],
      }),
      values: fee,
    };
  }

  deletePolicy(synPkg: DeletePolicySynPackage, opts: MultiMessageParamOptions): SendMessagesParams {
    assertBucketHubAddress(this.hubAddress.permissionHubAddress);

    const fee = opts.relayFee + opts.minAckRelayFee;
    return {
      target: this.hubAddress.permissionHubAddress,
      msgBytes: encodeFunctionData({
        abi: PermissionHubAbi,
        functionName: 'prepareDeletePolicy',
        args: [opts.sender, synPkg.id],
      }),
      values: fee,
    };
  }

  async sendMessages(params: SendMessagesParams[]) {
    if (params.length === 0) throw new Error('execute params is empty');

    const { targets, msgBytes, values } = splitMultiMessageParams(params);

    const sumValue = values.reduce((a, b) => a + b, BigInt(0));

    const { request } = await this.publicClient.simulateContract({
      account: this.account,
      address: this.multiMsgAddress,
      abi: parseAbi(MultiMessageAbi),
      functionName: 'sendMessages',
      args: [targets, msgBytes, values],
      value: sumValue,
    });

    const txHash = await this.walletClient.writeContract(request);

    return txHash;
  }
}
