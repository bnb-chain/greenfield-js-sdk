import {
  MsgCreatePaymentAccount,
  MsgDeposit,
  MsgDisableRefund,
  MsgWithdraw,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/payment/tx';
import {
  MsgCancelMigrateBucket,
  MsgCopyObject,
  MsgMigrateBucket,
  MsgSetBucketFlowRateLimit,
  MsgSetTag,
  MsgToggleSPAsDelegatedAgent,
  MsgUpdateBucketInfo,
  MsgUpdateGroupExtra,
  MsgUpdateObjectInfo,
} from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/tx';
import { toHex } from 'viem';
import { ExecuteParams } from '../../types';

// https://github.com/bnb-chain/greenfield-contracts/blob/develop/contracts/middle-layer/GreenfieldExecutor.sol

export class ExecutorMsg {
  static getCreatePaymentAccountParams = (msg: MsgCreatePaymentAccount): ExecuteParams => [
    1,
    toHex(MsgCreatePaymentAccount.encode(msg).finish()),
  ];

  static getDepositParams = (msg: MsgDeposit): ExecuteParams => [
    2,
    toHex(MsgDeposit.encode(msg).finish()),
  ];

  static getDisableRefundParams = (msg: MsgDisableRefund): ExecuteParams => [
    3,
    toHex(MsgDisableRefund.encode(msg).finish()),
  ];

  static getWithdrawParams = (msg: MsgWithdraw): ExecuteParams => [
    4,
    toHex(MsgWithdraw.encode(msg).finish()),
  ];

  static getMigrateBucketParams = (msg: MsgMigrateBucket): ExecuteParams => [
    5,
    toHex(MsgMigrateBucket.encode(msg).finish()),
  ];

  static getCancelMigrateBucketParams = (msg: MsgCancelMigrateBucket): ExecuteParams => [
    6,
    toHex(MsgCancelMigrateBucket.encode(msg).finish()),
  ];

  static getUpdateBucketInfoParams = (msg: MsgUpdateBucketInfo): ExecuteParams => [
    7,
    toHex(MsgUpdateBucketInfo.encode(msg).finish()),
  ];

  static getToggleSPAsDelegatedAgentParams = (msg: MsgToggleSPAsDelegatedAgent): ExecuteParams => [
    8,
    toHex(MsgToggleSPAsDelegatedAgent.encode(msg).finish()),
  ];

  static getSetBucketFlowRateLimitParams = (msg: MsgSetBucketFlowRateLimit): ExecuteParams => [
    9,
    toHex(MsgSetBucketFlowRateLimit.encode(msg).finish()),
  ];

  static getCopyObjectParams = (msg: MsgCopyObject): ExecuteParams => [
    10,
    toHex(MsgCopyObject.encode(msg).finish()),
  ];

  static getUpdateObjectInfoParams = (msg: MsgUpdateObjectInfo): ExecuteParams => [
    11,
    toHex(MsgUpdateObjectInfo.encode(msg).finish()),
  ];

  static getUpdateGroupExtraParams = (msg: MsgUpdateGroupExtra): ExecuteParams => [
    12,
    toHex(MsgUpdateGroupExtra.encode(msg).finish()),
  ];

  static getSetTagParams = (msg: MsgSetTag): ExecuteParams => [
    13,
    toHex(MsgSetTag.encode(msg).finish()),
  ];
}
