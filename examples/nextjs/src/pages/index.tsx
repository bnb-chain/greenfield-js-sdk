import { useIsMounted } from '@/hooks/useIsMounted';
import Link from 'next/link';

export default function Home() {
  const isMounted = useIsMounted();

  // https://github.com/ethers-io/ethers.js/issues/726

  if (!isMounted) return null;

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <li>
          <Link href="/tx" color="#900" style={{ fontSize: 30 }}>
            Tx
          </Link>
        </li>

        <li>
          <Link href="/query" color="#900" style={{ fontSize: 30 }}>
            Query
          </Link>
        </li>
      </div>
    </>
  );
}
