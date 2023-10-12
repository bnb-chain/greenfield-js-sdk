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

      <br />

      <button
        onClick={async () => {
          if (!address) return;

          const tx = await client.txClient.txRaw({
            address,
            eip712MsgType: {
              Msg1: [
                {
                  name: 'grant',
                  type: 'TypeMsg1Grant',
                },
                {
                  name: 'grantee',
                  type: 'string',
                },
                {
                  name: 'granter',
                  type: 'string',
                },
                {
                  name: 'type',
                  type: 'string',
                },
              ],
              Msg2: [
                {
                  name: 'initial_deposit',
                  type: 'TypeMsg2InitialDeposit[]',
                },
                {
                  name: 'messages',
                  type: 'TypeAny[]',
                },
                {
                  name: 'metadata',
                  type: 'string',
                },
                {
                  name: 'proposer',
                  type: 'string',
                },
                {
                  name: 'summary',
                  type: 'string',
                },
                {
                  name: 'title',
                  type: 'string',
                },
                {
                  name: 'type',
                  type: 'string',
                },
              ],
              TypeAny: [
                {
                  name: 'type',
                  type: 'string',
                },
                {
                  name: 'value',
                  type: 'bytes',
                },
              ],
              TypeMsg1Grant: [
                {
                  name: 'authorization',
                  type: 'TypeAny',
                },
                {
                  name: 'expiration',
                  type: 'string',
                },
              ],
              TypeMsg2InitialDeposit: [
                {
                  name: 'amount',
                  type: 'string',
                },
                {
                  name: 'denom',
                  type: 'string',
                },
              ],
              Tx: [
                {
                  name: 'account_number',
                  type: 'uint256',
                },
                {
                  name: 'chain_id',
                  type: 'uint256',
                },
                {
                  name: 'fee',
                  type: 'Fee',
                },
                {
                  name: 'memo',
                  type: 'string',
                },
                {
                  name: 'msg1',
                  type: 'Msg1',
                },
                {
                  name: 'msg2',
                  type: 'Msg2',
                },
                {
                  name: 'sequence',
                  type: 'uint256',
                },
                {
                  name: 'timeout_height',
                  type: 'uint256',
                },
              ],
            },
            msgData: {
              msg1: {
                grant: {
                  authorization: {
                    type: '/cosmos.staking.v1beta1.StakeAuthorization',
                    value:
                      'ZXlKQWRIbHdaU0k2SWk5amIzTnRiM011YzNSaGEybHVaeTUyTVdKbGRHRXhMbE4wWVd0bFFYVjBhRzl5YVhwaGRHbHZiaUlzSW1Gc2JHOTNYMnhwYzNRaU9uc2lZV1JrY21WemN5STZXeUl3ZURCaFFUVXhOekJET0RVMFFVRXdPVE5sTVdNek1rWXhOVEk0TldSRk5FSm1OMlkyT0RBeVEyVWlYWDBzSW1GMWRHaHZjbWw2WVhScGIyNWZkSGx3WlNJNklrRlZWRWhQVWtsYVFWUkpUMDVmVkZsUVJWOUVSVXhGUjBGVVJTSXNJbTFoZUY5MGIydGxibk1pT25zaVlXMXZkVzUwSWpvaU1UQXdNREF3TURBd01EQXdNREF3TURBd01EQXdNQ0lzSW1SbGJtOXRJam9pUWs1Q0luMTk=',
                  },
                  expiration: '',
                },
                grantee: '0x7b5Fe22B5446f7C62Ea27B8BD71CeF94e03f3dF2',
                granter: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
                type: '/cosmos.authz.v1beta1.MsgGrant',
              },
              msg2: {
                initial_deposit: [
                  {
                    amount: '1000000000000000000',
                    denom: 'BNB',
                  },
                ],
                messages: [
                  {
                    type: '/cosmos.staking.v1beta1.MsgCreateValidator',
                    value:
                      'eyJAdHlwZSI6Ii9jb3Ntb3Muc3Rha2luZy52MWJldGExLk1zZ0NyZWF0ZVZhbGlkYXRvciIsImJsc19rZXkiOiI4NmJmMWZlZTZjYjkwOGNmMjgzNjM2ZjVhMDk2NjBlNDlhMzk0ZjNiYzU4NTJjMWI4MjM4MTVhNjYzMzI3MGQzNTdhMzcwYjlkZmEwMGFlNGQ5MmFjYzNlNTAxM2ZlZDciLCJibHNfcHJvb2YiOiI4Y2YwYzQzZjEyNWJlNzc3MDI2NGFkMDMwYjhmMDg1NGY0MWYzNDVhMDg3ZjNjMWI4NjYwOWNiYmZmNzFkOTFjOTg4MzhiZWJhYzRkMGZhODA3YTZhZjYyNzU2NzQzNzIxNDRmZDZiYzcxYmRkMGY0MTQ4YWMwZTRmOWM3Y2Q3NDdhMDc4NzUzNTEzMWUxYTIwZGY3YmVlOGUyMmQ0NzE5ZmI4ZThlODVlYjBiMjRkNzkzODhjODA3NzZlNjQ2MWEiLCJjaGFsbGVuZ2VyX2FkZHJlc3MiOiIweDIxMjNCNjA3ZTFiOUU4QWU2NUZiRTEyNTg1QzFiRTY4MzhCYjMyQzciLCJjb21taXNzaW9uIjp7Im1heF9jaGFuZ2VfcmF0ZSI6IjAuMDEwMDAwMDAwMDAwMDAwMDAwIiwibWF4X3JhdGUiOiIxLjAwMDAwMDAwMDAwMDAwMDAwMCIsInJhdGUiOiIwLjA3MDAwMDAwMDAwMDAwMDAwMCJ9LCJkZWxlZ2F0b3JfYWRkcmVzcyI6IjB4MUM4OTM0NDFBQjZjMUE3NUUwMTg4NzA4N2VhNTA4YkU4ZTA3QUFhZSIsImRlc2NyaXB0aW9uIjp7ImRldGFpbHMiOiIiLCJpZGVudGl0eSI6IiIsIm1vbmlrZXIiOiJuYXNoIiwic2VjdXJpdHlfY29udGFjdCI6IiIsIndlYnNpdGUiOiIifSwiZnJvbSI6IjB4N2I1RmUyMkI1NDQ2ZjdDNjJFYTI3QjhCRDcxQ2VGOTRlMDNmM2RGMiIsIm1pbl9zZWxmX2RlbGVnYXRpb24iOiIxMDAwMDAwMDAwMDAwMDAwMDAwMDAwIiwicHVia2V5Ijp7IkB0eXBlIjoiL2Nvc21vcy5jcnlwdG8uZWQyNTUxOS5QdWJLZXkiLCJrZXkiOiIwY3NmL01zc2ZHT1FCcW1qazY5a0lURzBTT052OVgwSXdWWHQ1R3pzUEF3PSJ9LCJyZWxheWVyX2FkZHJlc3MiOiIweDIxMjNCNjA3ZTFiOUU4QWU2NUZiRTEyNTg1QzFiRTY4MzhCYjMyQzciLCJ2YWxpZGF0b3JfYWRkcmVzcyI6IjB4MGFBNTE3MEM4NTRBQTA5M2UxYzMyRjE1Mjg1ZEU0QmY3ZjY4MDJDZSIsInZhbHVlIjp7ImFtb3VudCI6IjEwMDAwMDAwMDAwMDAwMDAwMDAwMDAiLCJkZW5vbSI6IkJOQiJ9fQ==',
                  },
                ],
                metadata: '',
                proposer: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
                summary: 'create nash validator',
                title: 'Create nash Validator',
                type: '/cosmos.gov.v1.MsgSubmitProposal',
              },
            },
            txRawHex:
              '0x0a91090afc010a1e2f636f736d6f732e617574687a2e763162657461312e4d73674772616e7412d9010a2a307831433839333434314142366331413735453031383837303837656135303862453865303741416165122a3078376235466532324235343436663743363245613237423842443731436546393465303366336446321a7f0a7d0a2a2f636f736d6f732e7374616b696e672e763162657461312e5374616b65417574686f72697a6174696f6e124f0a1d0a03424e42121631303030303030303030303030303030303030303030122c0a2a30783061413531373043383534414130393365316333324631353238356445344266376636383032436520010a8f070a202f636f736d6f732e676f762e76312e4d73675375626d697450726f706f73616c12ea060af1050a2a2f636f736d6f732e7374616b696e672e763162657461312e4d736743726561746556616c696461746f7212c2050a060a046e617368123b0a1137303030303030303030303030303030301213313030303030303030303030303030303030301a1131303030303030303030303030303030301a1631303030303030303030303030303030303030303030222a3078314338393334343141423663314137354530313838373038376561353038624538653037414161652a2a30783061413531373043383534414130393365316333324631353238356445344266376636383032436532430a1d2f636f736d6f732e63727970746f2e656432353531392e5075624b657912220a20d1cb1ffccb2c7c639006a9a393af642131b448e36ff57d08c155ede46cec3c0c3a1d0a03424e42121631303030303030303030303030303030303030303030422a3078376235466532324235343436663743363245613237423842443731436546393465303366336446324a2a307832313233423630376531623945384165363546624531323538354331624536383338426233324337522a3078323132334236303765316239453841653635466245313235383543316245363833384262333243375a6038366266316665653663623930386366323833363336663561303936363065343961333934663362633538353263316238323338313561363633333237306433353761333730623964666130306165346439326163633365353031336665643762c001386366306334336631323562653737373032363461643033306238663038353466343166333435613038376633633162383636303963626266663731643931633938383338626562616334643066613830376136616636323735363734333732313434666436626337316264643066343134386163306534663963376364373437613037383735333531333165316132306466376265653865323264343731396662386538653835656230623234643739333838633830373736653634363161121a0a03424e421213313030303030303030303030303030303030301a2a3078314338393334343141423663314137354530313838373038376561353038624538653037414161652a15437265617465206e6173682056616c696461746f723215637265617465206e6173682076616c696461746f7212021200',
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
