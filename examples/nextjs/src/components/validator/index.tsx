import { client } from '@/client';
import { VALIDATOR_PRIVATEKEY } from '@/config/env';
import { Long } from '@bnb-chain/greenfield-js-sdk';
import { useAccount } from 'wagmi';
import { MsgSubmitProposal, MsgVote } from '@bnb-chain/greenfield-cosmos-types/cosmos/gov/v1/tx';
import {
  MsgCreateValidator,
  MsgEditValidator,
} from '@bnb-chain/greenfield-cosmos-types/cosmos/staking/v1beta1/tx';
import { Any } from '@bnb-chain/greenfield-cosmos-types/google/protobuf/any';
import { PubKey } from '@bnb-chain/greenfield-cosmos-types/cosmos/crypto/ed25519/keys';

/**
 * decrpred
 */
export const Validator = () => {
  const { address, connector } = useAccount();

  return (
    <>
      <h4>create validator</h4>
      <button
        onClick={async () => {
          if (!address) return;

          const createValidatorMsg = {
            blsKey:
              '85a874ce490ea46e3ed8883544496c8852de074094185ad5d881df95df71287c7a837da79b9e4e2aa5cee0d23ccff22f',
            blsProof:
              '9585baae6c196c98575626b86f15ea4b0c7e2d07947a58afe0a5deeb740e6d41e213e76eddc7d459809adaf4c2c8ed8401a6216a875cc0dfaaaf938ff7a57c109518671a592b0f9ed2105c8ec8e2d4031c4ffe473d7c4d505c4305ab008e1319',
            challengerAddress: '0xfFFb326C7246A06a98fE14E9BDCe74f8e62B7A14',
            commission: {
              maxChangeRate: '1',
              maxRate: '1',
              rate: '1',
            },
            delegatorAddress: '0x5E52a4fc7575806f8E6c1D48dCdC98F9fED8D11e',
            description: {
              details: 'BNBChain Validator',
              identity: '',
              moniker: 'BNBChain',
              securityContact: '',
              website: '',
            },
            //
            from: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
            minSelfDelegation: '1000000000000000000000',
            pubkey: Any.fromPartial({
              typeUrl: '/cosmos.crypto.ed25519.PubKey',
              value: PubKey.encode({
                key: Uint8Array.from([1, 2, 3, 4]),
              }).finish(),
            }),
            relayerAddress: '0x96931F9918e930D3e48c77aaA479349805DbcdCd',
            validatorAddress: '0x45D415799659720f4c90F7fd1Ef5D7390Ffc9166',
            value: {
              amount: '1000000000000000000000',
              denom: 'BNB',
            },
          };

          // const createValidatorTx = await client.validator.createValidator(
          //   address,
          //   createValidatorMsg,
          // );

          // console.log('createValidatorTx.metaTxInfo', createValidatorTx.metaTxInfo);

          const submitProposalTx = await client.proposal.submitProposal(createValidatorMsg, {
            initialDeposit: [
              {
                amount: '10000000000000000',
                denom: 'BNB',
              },
            ],
            messages: [
              Any.fromPartial({
                typeUrl: '/cosmos.staking.v1beta1.MsgCreateValidator',
                value: MsgCreateValidator.encode(createValidatorMsg).finish(),
              }),
            ],
            metadata: 'metadata',
            proposer: address,
            summary: 'summary',
            title: 'title',
          });

          console.log('submitProposalTx.meta', submitProposalTx.metaTxInfo);

          const simulateInfo = await submitProposalTx.simulate({
            denom: 'BNB',
          });

          console.log('simulateInfo', simulateInfo);

          const res = await submitProposalTx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo?.gasLimit),
            gasPrice: simulateInfo?.gasPrice || '5000000000',
            payer: address,
            granter: '',
          });

          if (res.code === 0) {
            alert('success');
          }
        }}
      >
        create validator
      </button>

      <br />

      <button
        onClick={async () => {
          const res = await client.validator.listValidators({
            status: 'BOND_STATUS_BONDED',
            pagination: {
              limit: Long.fromInt(10),
              offset: Long.fromInt(0),
              countTotal: true,
              key: Uint8Array.from([]),
              reverse: false,
            },
          });

          console.log('res', res);

          // console.log('blsKey', toHex(res.validators[0].blsKey));
        }}
      >
        list
      </button>

      <h4>edit validator</h4>
      <button
        onClick={async () => {
          if (!address) return;

          const editValidatorTx = await client.validator.editValidator(address, {
            blsKey:
              '0xb3c5eaba9ae74bc6308054f586db909ea8482d158b24789d66c47578bb9b293b7d00d5acfb0645e528f39526ff04994b',
            blsProof: '',
            challengerAddress: '0x52A57571D08692d2D60596DD9b588Ff59ACdf02E',
            description: {
              moniker: 'test',
              details: 'test',
              identity: 'test',
              securityContact: 'test',
              website: 'test',
            },
            relayerAddress: '0x68EA59d9aFB06a838E05d511eDdA2049D1b6fF61',
            validatorAddress: '0x84800aaFDD595f1b7C77292c98988ad424068470',
            commissionRate: '',
            minSelfDelegation: '',
          });

          const simulateInfo = await editValidatorTx.simulate({
            denom: 'BNB',
          });

          console.log('simulateInfo', simulateInfo);

          const res = await editValidatorTx.broadcast({
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
        edit validator
      </button>
    </>
  );
};
