import { MultiMessage } from '@/components/cross';
import { WalletInfo } from '@/components/walletInfo';
import { useIsMounted } from '@/hooks/useIsMounted';
import { useAccount } from 'wagmi';

export default function Cross() {
  const isMounted = useIsMounted();
  const { isConnected } = useAccount();

  if (!isMounted) return null;

  return (
    <div style={{ padding: 10 }}>
      <WalletInfo />

      <hr style={{ margin: '10px 0' }} />

      {isConnected && (
        <>
          <h2>Cross</h2>

          <MultiMessage />
        </>
      )}
    </div>
  );
}
