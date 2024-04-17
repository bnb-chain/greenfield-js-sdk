import { client, selectSp } from '@/client';
import { useAccount } from 'wagmi';

export const VirtualGroup = () => {
  const { address, connector } = useAccount();

  return (
    <div>
      <h3>Virtual Group</h3>

      <button
        onClick={async () => {
          if (!address) return;

          const sp = await selectSp();

          const tx = await client.virtualGroup.settle(address, {
            globalVirtualGroupFamilyId: 1,
            globalVirtualGroupIds: [2],
            storageProvider: sp.primarySpAddress,
          });

          const simuluateInfo = await tx.simulate({
            denom: 'BNB',
          });

          console.log('simuluateInfo', simuluateInfo);
          const res = await tx.broadcast({
            denom: 'BNB',
            gasLimit: Number(210000),
            gasPrice: '5000000000',
            payer: address,
            granter: '',
          });

          console.log('res', res);

          if (res.code === 0) {
            alert('success');
          }
        }}
      >
        settle
      </button>
      <br />
    </div>
  );
};
