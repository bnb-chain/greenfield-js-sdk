import { client } from '@/client';
import { VALIDATOR_PRIVATEKEY } from '@/config/env';
import { Long } from '@bnb-chain/greenfield-js-sdk';
import { useAccount } from 'wagmi';

export const Validator = () => {
  const { address, connector } = useAccount();

  return (
    <>
      {/* <h4>create validator</h4>
      <button
        onClick={async () => {
          if (!address) return;
          const createValidatorTx = await client.validator.createValidator(address, {
            description: {
              moniker: 'test',
              details: 'test',
              identity: 'test',
              securityContact: 'test',
              website: 'test',
            },
            blsKey: 'test',
            blsProof: '',
            challengerAddress: '0x4038993E087832D84e2Ac855d27f6b0b2EEc1907',
            relayerAddress: '0xA4A2957E858529FFABBBb483D1D704378a9fca6b',
            commission: {
              maxChangeRate: '10000000000000000',
              maxRate: '10000000000000000',
              rate: '10000000000000000',
            },
            delegatorAddress: address,
            from: address,
            value: ,

          });

          const simulateInfo = await createValidatorTx.simulate({
            denom: 'BNB',
          });

          console.log('simulateInfo', simulateInfo);

          const res = await createValidatorTx.broadcast({
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
        create
      </button> */}

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
