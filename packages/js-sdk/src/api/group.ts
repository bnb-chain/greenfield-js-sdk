import { TxClient } from '@/clients/txClient';
import { MsgCreateGroupSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgCreateGroup';
import { MsgDeleteGroupSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgDeleteGroup';
import { MsgLeaveGroupSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgLeaveGroup';
import { MsgUpdateGroupExtraSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgUpdateGroupExtra';
import { getMsgUpdateGroupMemberSDKTypeEIP712 } from '@/messages/greenfield/storage/MsgUpdateGroupMember';
import { GRNToString, newBucketGRN, newGroupGRN, newObjectGRN } from '@/utils/grn';
import {
  QueryGroupNFTResponse,
  QueryHeadGroupMemberResponse,
  QueryHeadGroupResponse,
  QueryListGroupsRequest,
  QueryListGroupsResponse,
  QueryNFTRequest,
  QueryPolicyForGroupRequest,
  QueryPolicyForGroupResponse,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/query';
import {
  MsgCreateGroup,
  MsgDeleteGroup,
  MsgLeaveGroup,
  MsgPutPolicy,
  MsgUpdateGroupExtra,
  MsgUpdateGroupMember,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { container, delay, inject, injectable } from 'tsyringe';
import {
  fromTimestamp,
  MsgCreateGroupTypeUrl,
  MsgDeleteGroupTypeUrl,
  MsgLeaveGroupTypeUrl,
  MsgUpdateGroupExtraTypeUrl,
  MsgUpdateGroupMemberTypeUrl,
  TxResponse,
} from '..';
import { RpcQueryClient } from '../clients/queryclient';
import { Storage } from './storage';

export interface IGroup {
  /**
   * create a new group on greenfield chain the group members can be initialized  or not
   */
  createGroup(msg: MsgCreateGroup): Promise<TxResponse>;

  /**
   * send DeleteGroup txn to greenfield chain and return txn hash
   */
  deleteGroup(msg: MsgDeleteGroup): Promise<TxResponse>;

  /**
   * support adding or removing members from the group and return the txn hash
   */
  updateGroupMember(msg: MsgUpdateGroupMember): Promise<TxResponse>;

  updateGroupExtra(msg: MsgUpdateGroupExtra): Promise<TxResponse>;

  /**
   * make the member leave the specific group
   */
  leaveGroup(address: string, msg: MsgLeaveGroup): Promise<TxResponse>;

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
   * @deprecated
   */
  listGroup(request: QueryListGroupsRequest): Promise<QueryListGroupsResponse>;

  headGroupNFT(request: QueryNFTRequest): Promise<QueryGroupNFTResponse>;

  /**
   * get the bucket policy info of the group specified by group id
   * it queries a bucket policy that grants permission to a group
   */
  getPolicyOfGroup(request: QueryPolicyForGroupRequest): Promise<QueryPolicyForGroupResponse>;

  getBucketPolicyOfGroup(bucketName: string, groupId: number): Promise<QueryPolicyForGroupResponse>;

  getObjectPolicyOfGroup(
    bucketName: string,
    objectName: string,
    groupId: number,
  ): Promise<QueryPolicyForGroupResponse>;

  putGroupPolicy(
    owner: string,
    groupName: string,
    srcMsg: Omit<MsgPutPolicy, 'resource' | 'expirationTime'>,
  ): Promise<TxResponse>;
}

@injectable()
export class Group implements IGroup {
  constructor(
    @inject(delay(() => TxClient)) private txClient: TxClient,
    @inject(delay(() => Storage)) private storage: Storage,
  ) {}

  private queryClient: RpcQueryClient = container.resolve(RpcQueryClient);

  public async createGroup(msg: MsgCreateGroup) {
    return await this.txClient.tx(
      MsgCreateGroupTypeUrl,
      msg.creator,
      MsgCreateGroupSDKTypeEIP712,
      MsgCreateGroup.toSDK(msg),
      MsgCreateGroup.encode(msg).finish(),
    );
  }

  public async deleteGroup(msg: MsgDeleteGroup) {
    return await this.txClient.tx(
      MsgDeleteGroupTypeUrl,
      msg.operator,
      MsgDeleteGroupSDKTypeEIP712,
      MsgDeleteGroup.toSDK(msg),
      MsgDeleteGroup.encode(msg).finish(),
    );
  }

  public async updateGroupMember(msg: MsgUpdateGroupMember) {
    if (msg.groupName === '') {
      throw new Error('group name is empty');
    }

    if (msg.membersToAdd.length === 0 && msg.membersToDelete.length === 0) {
      throw new Error('no update member');
    }

    return await this.txClient.tx(
      MsgUpdateGroupMemberTypeUrl,
      msg.operator,
      getMsgUpdateGroupMemberSDKTypeEIP712({
        membersToAdd: msg.membersToAdd,
        membersToDelete: msg.membersToDelete,
      }),
      {
        ...MsgUpdateGroupMember.toSDK(msg),
        members_to_add: msg.membersToAdd.map((x) => {
          return {
            member: x.member,
            expiration_time: fromTimestamp(x.expirationTime),
          };
        }),
      },
      MsgUpdateGroupMember.encode(msg).finish(),
    );
  }

  public async updateGroupExtra(msg: MsgUpdateGroupExtra) {
    return await this.txClient.tx(
      MsgUpdateGroupExtraTypeUrl,
      msg.operator,
      MsgUpdateGroupExtraSDKTypeEIP712,
      MsgUpdateGroupExtra.toSDK(msg),
      MsgUpdateGroupExtra.encode(msg).finish(),
    );
  }

  public async leaveGroup(address: string, msg: MsgLeaveGroup) {
    return await this.txClient.tx(
      MsgLeaveGroupTypeUrl,
      address,
      MsgLeaveGroupSDKTypeEIP712,
      MsgLeaveGroup.toSDK(msg),
      MsgLeaveGroup.encode(msg).finish(),
    );
  }

  public async headGroup(groupName: string, groupOwner: string) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.HeadGroup({
      groupName,
      groupOwner,
    });
  }

  public async headGroupMember(groupName: string, groupOwner: string, member: string) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.HeadGroupMember({
      groupName,
      groupOwner,
      member,
    });
  }

  public async headGroupNFT(request: QueryNFTRequest) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.HeadGroupNFT(request);
  }

  public async listGroup(request: QueryListGroupsRequest) {
    const rpc = await this.queryClient.getStorageQueryClient();
    return await rpc.ListGroups(request);
  }

  public async getPolicyOfGroup(request: QueryPolicyForGroupRequest) {
    return await this.storage.getPolicyForGroup(request);
  }

  public async getBucketPolicyOfGroup(bucketName: string, groupId: number) {
    const resource = GRNToString(newBucketGRN(bucketName));
    return await this.storage.getPolicyForGroup({
      resource,
      principalGroupId: groupId.toString(),
    });
  }

  public async getObjectPolicyOfGroup(bucketName: string, objectName: string, groupId: number) {
    const resource = GRNToString(newObjectGRN(bucketName, objectName));

    return await this.storage.getPolicyForGroup({
      resource,
      principalGroupId: groupId.toString(),
    });
  }

  public async putGroupPolicy(
    owner: string,
    groupName: string,
    srcMsg: Omit<MsgPutPolicy, 'resource' | 'expirationTime'>,
  ) {
    const resource = GRNToString(newGroupGRN(owner, groupName));
    const msg: MsgPutPolicy = {
      ...srcMsg,
      resource,
    };
    return this.storage.putPolicy(msg);
  }
}
