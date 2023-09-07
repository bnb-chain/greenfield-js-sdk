import { TxClient } from '@/clients/txClient';
import { MsgVoteSDKTypeEIP712 } from '@/messages/cosmos/gov/MsgVote';
import { voteOptionToJSON } from '@bnb-chain/greenfield-cosmos-types/cosmos/gov/v1/gov';
import { MsgVote } from '@bnb-chain/greenfield-cosmos-types/cosmos/gov/v1/tx';
import { delay, inject, singleton } from 'tsyringe';
import { MsgVoteTypeUrl, TxResponse } from '..';

export interface IProposal {
  /**
   * NOTICE: only validator can use this api
   */
  voteProposal(msg: MsgVote): Promise<TxResponse>;
}

@singleton()
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
}
