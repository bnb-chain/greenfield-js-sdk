import { RpcComponent } from '@/components/rpc';
import { WalletInfo } from '@/components/walletInfo';
import { useIsMounted } from '@/hooks/useIsMounted';
import { useAccount } from 'wagmi';

export default function Rpc() {
  const isMounted = useIsMounted();
  const { isConnected } = useAccount();

  if (!isMounted) return null;

  return (
    <div style={{ padding: 10 }}>
      <WalletInfo />

      <hr style={{ margin: '10px 0' }} />

      {isConnected && (
        <>
          <h2>RPC</h2>

          <RpcComponent />
        </>
      )}
    </div>
  );
}
