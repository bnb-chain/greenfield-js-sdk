import { MsgVoteSDKTypeEIP712 } from '@/messages/cosmos/gov/MsgVote';
import { voteOptionFromJSON } from '@bnb-chain/greenfield-cosmos-types/cosmos/gov/v1/gov';
import { MsgVote } from '@bnb-chain/greenfield-cosmos-types/cosmos/gov/v1/tx';
import { delay, inject, singleton } from 'tsyringe';
import { MsgVoteTypeUrl, TxResponse } from '..';
import { Basic } from './basic';

export interface IProposal {
  voteProposal(msg: MsgVote): Promise<TxResponse>;
}

@singleton()
export class Proposal implements IProposal {
  constructor(@inject(delay(() => Basic)) private basic: Basic) {}

  public async voteProposal(msg: MsgVote) {
    return await this.basic.tx(
      MsgVoteTypeUrl,
      msg.voter,
      MsgVoteSDKTypeEIP712,
      {
        ...MsgVote.toSDK(msg),
        option: voteOptionFromJSON(msg.option),
      },
      MsgVote.encode(msg).finish(),
    );
  }
}
