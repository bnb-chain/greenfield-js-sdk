import { Policy } from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/types';
import { Address, encodeFunctionData, parseAbi, toHex } from 'viem';
import {
  PrepareCreateBucketHubAbi,
  PrepareCreateBucketHubCallbackAbi,
  PrepareDeleteBucketHubAbi,
  PrepareDeleteBucketHubCallbackAbi,
} from '../../abi/BucketHub.abi';
import {
  PrepareCreateGroupAbi,
  PrepareCreateGroupHubCallbackAbi,
  PrepareDeleteGroupHubAbi,
  PrepareDeleteGroupHubCallbackAbi,
  PrepareUpdateGroupHubAbi,
  PrepareUpdateGroupHubCallbackAbi,
} from '../../abi/GroupHub.abi';
import { MultiMessageAbi } from '../../abi/MultiMessage.abi';
import { PrepareDeleteObjectAbi, PrepareDeleteObjectCallbackAbi } from '../../abi/ObjectHub.abi';
import {
  PrepareCreatePolicyAbi,
  PrepareCreatePolicyCallbackAbi,
  PrepareDeletePolicyAbi,
  PrepareDeletePolicyCallbackAbi,
} from '../../abi/PermissionHub.abi';
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

    if (opts.cb) throw new Error('callback is not supported in transferOut');

    let fee = this.calculateFee(opts);
    fee += synPkg.amount;

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

    const fee = this.calculateFee(opts);
    return {
      target: this.hubAddress.groupHubAddress,
      msgBytes: encodeFunctionData({
        abi: opts.cb ? PrepareUpdateGroupHubCallbackAbi : PrepareUpdateGroupHubAbi,
        functionName: 'prepareUpdateGroup',
        args: !opts.cb
          ? [opts.sender, synPkg]
          : [opts.sender, synPkg, opts.cb.gasLimit, opts.cb.extraData],
      }),
      values: fee,
    };
  }

  createGroup(synPkg: CreateGroupSynPackage, opts: MultiMessageParamOptions): SendMessagesParams {
    assertHubAddress(
      'group hub address is required in init params',
      this.hubAddress.groupHubAddress,
    );

    const fee = this.calculateFee(opts);
    return {
      target: this.hubAddress.groupHubAddress,
      msgBytes: encodeFunctionData({
        abi: opts.cb ? PrepareCreateGroupHubCallbackAbi : PrepareCreateGroupAbi,
        functionName: 'prepareCreateGroup',
        args: !opts.cb
          ? [opts.sender, synPkg.owner, synPkg.name]
          : [opts.sender, synPkg.owner, synPkg.name, opts.cb.gasLimit, opts.cb.extraData],
      }),
      values: fee,
    };
  }

  deleteGroup(synPkg: DeleteGroupSynPackage, opts: MultiMessageParamOptions): SendMessagesParams {
    assertHubAddress(
      'group hub address is required in init params',
      this.hubAddress.groupHubAddress,
    );

    const fee = this.calculateFee(opts);
    return {
      target: this.hubAddress.groupHubAddress,
      msgBytes: encodeFunctionData({
        abi: opts.cb ? PrepareDeleteGroupHubCallbackAbi : PrepareDeleteGroupHubAbi,
        functionName: 'prepareDeleteGroup',
        args: !opts.cb
          ? [opts.sender, synPkg.id]
          : [opts.sender, synPkg.id, opts.cb.gasLimit, opts.cb.extraData],
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

    const fee = this.calculateFee(opts);
    return {
      target: this.hubAddress.bucketHubAddress,
      msgBytes: encodeFunctionData({
        abi: opts.cb ? PrepareCreateBucketHubCallbackAbi : PrepareCreateBucketHubAbi,
        functionName: 'prepareCreateBucket',
        args: !opts.cb
          ? [opts.sender, synPkg]
          : [opts.sender, synPkg, opts.cb.gasLimit, opts.cb.extraData],
      }),
      values: fee,
    };
  }

  deleteBucket(synPkg: DeleteBucketSynPackage, opts: MultiMessageParamOptions): SendMessagesParams {
    assertHubAddress(
      'bucket hub address is required in init params',
      this.hubAddress.bucketHubAddress,
    );

    const fee = this.calculateFee(opts);
    return {
      target: this.hubAddress.bucketHubAddress,
      msgBytes: encodeFunctionData({
        abi: opts.cb ? PrepareDeleteBucketHubCallbackAbi : PrepareDeleteBucketHubAbi,
        functionName: 'prepareDeleteBucket',
        args: !opts.cb
          ? [opts.sender, synPkg.id]
          : [opts.sender, synPkg.id, opts.cb.gasLimit, opts.cb.extraData],
      }),
      values: fee,
    };
  }

  deleteObject(synPkg: DeleteObjectSynPackage, opts: MultiMessageParamOptions): SendMessagesParams {
    assertHubAddress(
      'object hub address is required in init params',
      this.hubAddress.objectHubAddress,
    );

    const fee = this.calculateFee(opts);
    return {
      target: this.hubAddress.objectHubAddress,
      msgBytes: encodeFunctionData({
        abi: opts.cb ? PrepareDeleteObjectCallbackAbi : PrepareDeleteObjectAbi,
        functionName: 'prepareDeleteObject',
        args: !opts.cb
          ? [opts.sender, synPkg.id]
          : [opts.sender, synPkg.id, opts.cb.gasLimit, opts.cb.extraData],
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

    const fee = this.calculateFee(opts);
    return {
      target: this.hubAddress.permissionHubAddress,
      msgBytes: encodeFunctionData({
        abi: opts.cb ? PrepareCreatePolicyCallbackAbi : PrepareCreatePolicyAbi,
        functionName: 'prepareCreatePolicy',
        args: !opts.cb ? [opts.sender, data] : [opts.sender, data, opts.cb.extraData],
      }),
      values: fee,
    };
  }

  deletePolicy(synPkg: DeletePolicySynPackage, opts: MultiMessageParamOptions): SendMessagesParams {
    assertHubAddress(
      'permission hub address is required in init params',
      this.hubAddress.permissionHubAddress,
    );

    const fee = this.calculateFee(opts);
    return {
      target: this.hubAddress.permissionHubAddress,
      msgBytes: encodeFunctionData({
        abi: opts.cb ? PrepareDeletePolicyCallbackAbi : PrepareDeletePolicyAbi,
        functionName: 'prepareDeletePolicy',
        args: !opts.cb ? [opts.sender, synPkg.id] : [opts.sender, synPkg.id, opts.cb.extraData],
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

  private calculateFee(opts: MultiMessageParamOptions) {
    let fee = opts.relayFee + opts.minAckRelayFee;

    if (opts.cb) {
      const callbackGasCost = opts.cb.gasLimit * opts.cb.gasPrice;
      fee += callbackGasCost;
    }

    return fee;
  }
}
