import { Policy } from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/types';
import { Address, encodeFunctionData, parseAbi, toHex } from 'viem';
import { BucketHubAbi } from '../../abi/BucketHub.abi';
import { GroupHubAbi } from '../../abi/GroupHub.abi';
import { MultiMessageAbi } from '../../abi/MultiMessage.abi';
import { ObjectHubAbi } from '../../abi/ObjectHub.abi';
import { PermissionHubAbi } from '../../abi/PermissionHub.abi';
import { TokenHubAbi } from '../../abi/TokenHub.abi';
import { assertAddress, assertHubAddress } from '../../asserts';
import {
  BasicClientParams,
  CreateBucketSynPackage,
  CreateGroupSynPackage,
  DeleteBucketSynPackage,
  DeleteGroupSynPackage,
  DeleteObjectSynPackage,
  DeletePolicySynPackage,
  HubAddresses,
  MultiMessageParamOptions,
  SendMessagesParams,
  TransferOutSynPackage,
  UpdateGroupSynPackage,
} from '../../types';
import { splitMultiMessageParams } from '../../utils';
import { BasicClient } from '../basic';

interface IMultiMessageClient {
  createBucket(synPkg: CreateBucketSynPackage, opts: MultiMessageParamOptions): SendMessagesParams;

  deleteBucket(synPkg: DeleteBucketSynPackage, opts: MultiMessageParamOptions): SendMessagesParams;

  deleteObject(synPkg: DeleteObjectSynPackage, opts: MultiMessageParamOptions): SendMessagesParams;

  createGroup(synPkg: CreateGroupSynPackage, opts: MultiMessageParamOptions): SendMessagesParams;

  deleteGroup(synPkg: DeleteGroupSynPackage, opts: MultiMessageParamOptions): SendMessagesParams;

  updateGroup(synPkg: UpdateGroupSynPackage, opts: MultiMessageParamOptions): SendMessagesParams;

  /**
   * `createPolicy` is special function, need pass Greenfield protobuf message not synPackage message
   */
  createPolicy(msg: Policy, opts: MultiMessageParamOptions): SendMessagesParams;

  deletePolicy(synPkg: DeletePolicySynPackage, opts: MultiMessageParamOptions): SendMessagesParams;

  transferOut(synPkg: TransferOutSynPackage, opts: MultiMessageParamOptions): SendMessagesParams;

  sendMessages(params: SendMessagesParams[]): Promise<Address>;
}

export class MultiMessageClient extends BasicClient implements IMultiMessageClient {
  constructor(
    initParams: BasicClientParams,
    public multiMsgAddress: `0x${string}`,
    public hubAddress: HubAddresses,
  ) {
    super(initParams);
    this.multiMsgAddress = multiMsgAddress;
    this.hubAddress = hubAddress;
  }

  transferOut(synPkg: TransferOutSynPackage, opts: MultiMessageParamOptions): SendMessagesParams {
    assertHubAddress(
      'token hub address is required in init params',
      this.hubAddress.tokenHubAddress,
    );

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
    assertHubAddress(
      'group hub address is required in init params',
      this.hubAddress.groupHubAddress,
    );

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
    assertHubAddress(
      'group hub address is required in init params',
      this.hubAddress.groupHubAddress,
    );

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
    assertHubAddress(
      'group hub address is required in init params',
      this.hubAddress.groupHubAddress,
    );

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
    assertHubAddress(
      'bucket hub address is required in init params',
      this.hubAddress.bucketHubAddress,
    );
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
    assertHubAddress(
      'bucket hub address is required in init params',
      this.hubAddress.bucketHubAddress,
    );

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
    assertHubAddress(
      'object hub address is required in init params',
      this.hubAddress.objectHubAddress,
    );

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
    assertHubAddress(
      'permission hub address is required in init params',
      this.hubAddress.permissionHubAddress,
    );

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
    assertHubAddress(
      'permission hub address is required in init params',
      this.hubAddress.permissionHubAddress,
    );

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
