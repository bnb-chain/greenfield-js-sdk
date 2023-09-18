import { client } from '@/client';
import { useAccount } from 'wagmi';

export const CustomTx = () => {
  const { address } = useAccount();

  return (
    <>
      <h4>Custome Tx</h4>

      <br />
      <button
        onClick={async () => {
          if (!address) return;
          const tx = await client.txClient.txRaw({
            address,
            eip712MsgType: {
              Msg1: [
                {
                  name: 'expiration_time',
                  type: 'string',
                },
                {
                  name: 'operator',
                  type: 'string',
                },
                {
                  name: 'principal',
                  type: 'TypeMsg1Principal',
                },
                {
                  name: 'resource',
                  type: 'string',
                },
                {
                  name: 'type',
                  type: 'string',
                },
              ],
              TypeMsg1Principal: [
                {
                  name: 'type',
                  type: 'string',
                },
                {
                  name: 'value',
                  type: 'string',
                },
              ],
            },
            msgData: {
              expiration_time: '',
              operator: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
              principal: {
                type: 'PRINCIPAL_TYPE_GNFD_ACCOUNT',
                value: '0x91D7deA99716Cbb247E81F1cfB692009164a967E',
              },
              resource: 'grn:o::foo/vvv',
              type: '/greenfield.storage.MsgPutPolicy',
            },
            txRawHex:
              '0x0a93010a90010a202f677265656e6669656c642e73746f726167652e4d7367507574506f6c696379126c0a2a307831433839333434314142366331413735453031383837303837656135303862453865303741416165122e0801122a3078393144376465413939373136436262323437453831463163664236393230303931363461393637451a0e67726e3a6f3a3a666f6f2f76767612021200',
          });

          const simulateInfo = await tx.simulate({
            denom: 'BNB',
          });

          console.log(simulateInfo);

          const res = await tx.broadcast({
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
        broadcast with simulate
      </button>
    </>
  );
};
