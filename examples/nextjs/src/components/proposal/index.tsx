import { client } from '@/client';
import { VALIDATOR_PRIVATEKEY } from '@/config/env';
import { Long } from '@bnb-chain/greenfield-js-sdk';
import { useAccount } from 'wagmi';

export const Proposal = () => {
  const { address, connector } = useAccount();

  return (
    <>
      <h3>proposal</h3>
      <h4>vote</h4>
      <button
        onClick={async () => {
          if (!address) return;

          const voteProposalTx = await client.proposal.voteProposal({
            metadata: 'meta',
            option: 1,
            proposalId: Long.fromString('15'),
            voter: address,
          });

          const simulateInfo = await voteProposalTx.simulate({
            denom: 'BNB',
          });

          console.log('simulateInfo', simulateInfo);

          const res = await voteProposalTx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo?.gasLimit),
            gasPrice: simulateInfo?.gasPrice || '5000000000',
            payer: address,
            granter: '',
            privateKey: VALIDATOR_PRIVATEKEY,
          });

          if (res.code === 0) {
            alert('success');
          }
        }}
      >
        vote proposal
      </button>
    </>
  );
};
