import { TxClient } from '@/clients/txClient';
import { MsgSubmitProposalSDKTypeEIP712 } from '@/messages/cosmos/gov/MsgSubmitProposal';
import { MsgVoteSDKTypeEIP712 } from '@/messages/cosmos/gov/MsgVote';
import { voteOptionToJSON } from '@bnb-chain/greenfield-cosmos-types/cosmos/gov/v1/gov';
import { MsgSubmitProposal, MsgVote } from '@bnb-chain/greenfield-cosmos-types/cosmos/gov/v1/tx';
import { MsgCreateValidator } from '@bnb-chain/greenfield-cosmos-types/cosmos/staking/v1beta1/tx';
import { Any } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/any';
import { arrayify, hexlify } from '@ethersproject/bytes';
import { delay, inject, injectable } from 'tsyringe';
import {
  base64FromBytes,
  encodeToHex,
  MsgSubmitProposalTypeUrl,
  MsgVoteTypeUrl,
  TxResponse,
} from '..';

export interface IProposal {
  /**
   * NOTICE: only validator can use this api
   */
  submitProposal(createValidatorTx: object, srcMsg: MsgSubmitProposal): Promise<TxResponse>;

  /**
   * NOTICE: only validator can use this api
   */
  voteProposal(msg: MsgVote): Promise<TxResponse>;
}

@injectable()
export class Proposal implements IProposal {
  constructor(@inject(delay(() => TxClient)) private txClient: TxClient) {}

  public async voteProposal(msg: MsgVote) {
    return await this.txClient.tx(
      MsgVoteTypeUrl,
      msg.voter,
      MsgVoteSDKTypeEIP712,
      {
        ...MsgVote.toSDK(msg),
        option: voteOptionToJSON(msg.option),
        proposal_id: msg.proposalId.toNumber(),
      },
      MsgVote.encode(msg).finish(),
    );
  }

  public async submitProposal(createMsg: MsgCreateValidator, submitMsg: MsgSubmitProposal) {
    return await this.txClient.tx(
      MsgSubmitProposalTypeUrl,
      submitMsg.proposer,
      MsgSubmitProposalSDKTypeEIP712,
      {
        ...MsgSubmitProposal.toSDK(submitMsg),
        messages: [
          {
            type: '/cosmos.staking.v1beta1.MsgCreateValidator',
            value: encodeToHex(JSON.stringify(createMsg)),
            // base64FromBytes(arrayify('0x' + encodeToHex(JSON.stringify(createMsg)))),
          },
        ],
      },
      MsgSubmitProposal.encode(submitMsg).finish(),
    );
  }
}
