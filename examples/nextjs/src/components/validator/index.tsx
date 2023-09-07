import { client } from '@/client';
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
        }}
      >
        list
      </button>

      <h4>edit validator</h4>
      <button
        onClick={async () => {
          if (!address) return;

          const editValidatorTx = await client.validator.editValidator(address, {
            blsKey: '0x00000000000000000000',
            blsProof: '',
            challengerAddress: '0x1C893441AB6c1A75E01887087ea508bE8e07AAa0',
            description: {
              moniker: 'test',
              details: 'test',
              identity: 'test',
              securityContact: 'test',
              website: 'test',
            },
            relayerAddress: '0x1C893441AB6c1A75E01887087ea508bE8e07AAa1',
            validatorAddress: address,
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
