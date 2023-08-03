import { client } from '@/client';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const DeleteGroup = () => {
  const { address, connector } = useAccount();

  const [deleteGroupInfo, setDeleteGroupInfo] = useState({
    bucketName: '',
  });

  return (
    <div>
      <h3>delete group</h3>

      <input
        value={deleteGroupInfo.bucketName}
        placeholder="group name"
        onChange={(e) => {
          setDeleteGroupInfo({ ...setDeleteGroupInfo, bucketName: e.target.value });
        }}
      />

      <button
        onClick={async () => {
          if (!address) return;

          const deleteGroupTx = await client.group.deleteGroup({
            groupName: deleteGroupInfo.bucketName,
            operator: address,
          });

          const simulateInfo = await deleteGroupTx.simulate({
            denom: 'BNB',
          });

          console.log(simulateInfo);

          const res = await deleteGroupTx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo.gasLimit),
            gasPrice: simulateInfo.gasPrice,
            payer: address,
            granter: '',
            signTypedDataCallback: async (addr: string, message: string) => {
              const provider = await connector?.getProvider();
              return await provider?.request({
                method: 'eth_signTypedData_v4',
                params: [addr, message],
              });
            },
          });

          if (res.code === 0) {
            alert('delete group success');
          }

          console.log(res);
        }}
      >
        delete group
      </button>
    </div>
  );
};
