import { Bucket } from '@/components/bucket';
import { Deposit } from '@/components/deposit';
import { ObjectComponent } from '@/components/object';
import { Transfer } from '@/components/transfer';
import { TransferArv } from '@/components/transfer/index.arv';
import { WalletInfo } from '@/components/walletInfo';
import { Withdraw } from '@/components/withdraw';
import { useIsMounted } from '@/hooks/useIsMounted';
import { useAccount } from 'wagmi';

export default function Tx() {
  const isMounted = useIsMounted();
  const { isConnected } = useAccount();

  if (!isMounted) return null;

  return (
    <div style={{ padding: 10 }}>
      <WalletInfo />

      <hr style={{ margin: '10px 0' }} />

      {isConnected && (
        <>
          <Deposit />
          <hr style={{ margin: '10px 0' }} />
          <Transfer />
          {/* <TransferArv /> */}
          <hr style={{ margin: '10px 0' }} />
          <Withdraw />
          <hr style={{ margin: '10px 0' }} />
          <Bucket />
          <hr style={{ margin: '10px 0' }} />
          <ObjectComponent />
        </>
      )}
    </div>
  );
}
