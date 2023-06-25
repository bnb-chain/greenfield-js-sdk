import { getSps, client } from '@/client';
import { IGenOffChainAuthKeyPairAndUpload } from '@bnb-chain/greenfield-chain-sdk';
import { useAccount, useNetwork } from 'wagmi';

export const OffChainAuth = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const onGenOffChainAuthKeyPairClick = async () => {
    const sps = await getSps();
    const spsForSign = sps.map((item: any) => ({
      address: item.operatorAddress,
      name: item.description.moniker,
      endpoint: item.endpoint,
    }));
    const signAndUploadKeyOption: IGenOffChainAuthKeyPairAndUpload = {
      address: address!,
      domain: window.location.origin,
      chainId: +(chain?.id || 0),
      expirationMs: 5 * 24 * 60 * 60 * 1000,
      sps: spsForSign,
    };
    const { code, body, message } = await client.offchainauth.genOffChainAuthKeyPairAndUpload(
      signAndUploadKeyOption,
      window?.ethereum,
    );
    if (code !== 0) {
      console.log('gen offchainauth key pair error', message);
      return;
    }
    const key = `${address}-${chain?.id}`;
    localStorage.setItem(key, JSON.stringify(body));
    if (code === 0) {
      alert('success');
    }
  };

  return (
    <>
      <h2>OffChainAuth</h2>
      <button onClick={onGenOffChainAuthKeyPairClick}>gen offChainAuth key pair</button>
    </>
  );
};
