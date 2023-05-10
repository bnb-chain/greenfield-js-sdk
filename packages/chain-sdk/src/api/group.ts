import { ISimulateGasFee } from '@/utils/units';
import { MsgCreateGroupSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/storage/MsgCreateGroupSDKTypeEIP712';
import { MsgDeleteGroupSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/storage/MsgDeleteGroupSDKTypeEIP712';
import { MsgLeaveGroupSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/storage/MsgLeaveGroupSDKTypeEIP712';
import { MsgUpdateGroupMemberSDKTypeEIP712 } from '@bnb-chain/greenfield-cosmos-types/eip712/greenfield/storage/MsgUpdateGroupMemberSDKTypeEIP712';
import {
  QueryHeadGroupMemberResponse,
  QueryHeadGroupResponse,
  QueryPolicyForGroupRequest,
  QueryPolicyForGroupResponse,
  QueryClientImpl as StorageQueryClientImpl,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/query';
import {
  MsgCreateGroup,
  MsgDeleteGroup,
  MsgLeaveGroup,
  MsgUpdateGroupMember,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { DeliverTxResponse } from '@cosmjs/stargate';
import { Account } from './account';
import { ITxOption } from './basic';

export interface IGroup {
  /**
   * create a new group on greenfield chain the group members can be initialized  or not
   */
  createGroup(
    msg: MsgCreateGroup,
    txOption: ITxOption,
  ): Promise<DeliverTxResponse | ISimulateGasFee>;

  /**
   * send DeleteGroup txn to greenfield chain and return txn hash
   */
  deleteGroup(
    msg: MsgDeleteGroup,
    txOption: ITxOption,
  ): Promise<DeliverTxResponse | ISimulateGasFee>;

  /**
   * support adding or removing members from the group and return the txn hash
   */
  updateGroupMember(
    msg: MsgUpdateGroupMember,
    txOption: ITxOption,
  ): Promise<DeliverTxResponse | ISimulateGasFee>;

  /**
   * make the member leave the specific group
   */
  leaveGroup(
    address: string,
    msg: MsgLeaveGroup,
    txOption: ITxOption,
  ): Promise<DeliverTxResponse | ISimulateGasFee>;

  /**
   * query the groupInfo on chain, return the group info if exists
   */
  headGroup(groupName: string, groupOwner: string): Promise<QueryHeadGroupResponse>;

  /**
   * query the group member info on chain, return true if the member exists in group
   */
  headGroupMember(
    groupName: string,
    groupOwner: string,
    member: string,
  ): Promise<QueryHeadGroupMemberResponse>;

  /**
   * get the bucket policy info of the group specified by group id
   * it queries a bucket policy that grants permission to a group
   */
  getPolicyOfGroup(request: QueryPolicyForGroupRequest): Promise<QueryPolicyForGroupResponse>;
}

export class Group extends Account implements IGroup {
  public async createGroup(msg: MsgCreateGroup, txOption: ITxOption) {
    const typeUrl = '/bnbchain.greenfield.storage.MsgCreateGroup';
    const msgBytes = MsgCreateGroup.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.creator);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgCreateGroupSDKTypeEIP712,
      MsgCreateGroup.toSDK(msg),
      bodyBytes,
      accountInfo,
      {
        denom: txOption.denom,
        gasLimit: txOption.gasLimit,
        gasPrice: txOption.gasPrice,
        payer: accountInfo.address,
        granter: '',
      },
    );

    return await this.broadcastRawTx(rawTxBytes);
  }

  public async deleteGroup(msg: MsgDeleteGroup, txOption: ITxOption) {
    const typeUrl = '/bnbchain.greenfield.storage.MsgDeleteGroup';
    const msgBytes = MsgDeleteGroup.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.operator);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgDeleteGroupSDKTypeEIP712,
      MsgDeleteGroup.toSDK(msg),
      bodyBytes,
      accountInfo,
      {
        denom: txOption.denom,
        gasLimit: txOption.gasLimit,
        gasPrice: txOption.gasPrice,
        payer: accountInfo.address,
        granter: '',
      },
    );

    return await this.broadcastRawTx(rawTxBytes);
  }

  public async updateGroupMember(msg: MsgUpdateGroupMember, txOption: ITxOption) {
    if (msg.groupName === '') {
      throw new Error('group name is empty');
    }

    if (msg.membersToAdd.length === 0 && msg.membersToDelete.length === 0) {
      throw new Error('no update member');
    }

    const typeUrl = '/bnbchain.greenfield.storage.MsgUpdateGroupMember';
    const msgBytes = MsgUpdateGroupMember.encode(msg).finish();
    const accountInfo = await this.getAccount(msg.operator);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgUpdateGroupMemberSDKTypeEIP712,
      MsgUpdateGroupMember.toSDK(msg),
      bodyBytes,
      accountInfo,
      {
        denom: txOption.denom,
        gasLimit: txOption.gasLimit,
        gasPrice: txOption.gasPrice,
        payer: accountInfo.address,
        granter: '',
      },
    );

    return await this.broadcastRawTx(rawTxBytes);
  }

  public async leaveGroup(address: string, msg: MsgLeaveGroup, txOption: ITxOption) {
    const typeUrl = '/bnbchain.greenfield.storage.MsgLeaveGroup';
    const msgBytes = MsgLeaveGroup.encode(msg).finish();
    const accountInfo = await this.getAccount(address);
    const bodyBytes = this.getBodyBytes(typeUrl, msgBytes);

    if (txOption.simulate) {
      return await this.simulateRawTx(bodyBytes, accountInfo, {
        denom: txOption.denom,
      });
    }

    const rawTxBytes = await this.getRawTxBytes(
      typeUrl,
      MsgLeaveGroupSDKTypeEIP712,
      MsgLeaveGroup.toSDK(msg),
      bodyBytes,
      accountInfo,
      {
        denom: txOption.denom,
        gasLimit: txOption.gasLimit,
        gasPrice: txOption.gasPrice,
        payer: accountInfo.address,
        granter: '',
      },
    );

    return await this.broadcastRawTx(rawTxBytes);
  }

  public async headGroup(groupName: string, groupOwner: string) {
    const rpcClient = await this.getRpcClient();
    const rpc = new StorageQueryClientImpl(rpcClient);
    return await rpc.HeadGroup({
      groupName,
      groupOwner,
    });
  }

  public async headGroupMember(groupName: string, groupOwner: string, member: string) {
    const rpcClient = await this.getRpcClient();
    const rpc = new StorageQueryClientImpl(rpcClient);
    return await rpc.HeadGroupMember({
      groupName,
      groupOwner,
      member,
    });
  }

  public async getPolicyOfGroup(request: QueryPolicyForGroupRequest) {
    const rpcClient = await this.getRpcClient();
    const rpc = new StorageQueryClientImpl(rpcClient);
    return await rpc.QueryPolicyForGroup(request);
  }
}
