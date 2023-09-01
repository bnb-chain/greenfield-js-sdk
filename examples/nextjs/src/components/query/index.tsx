import { client } from '@/client';
import { Long } from '@bnb-chain/greenfield-js-sdk';
import { useAccount } from 'wagmi';

export const QueryComponent = () => {
  const { address } = useAccount();
  return (
    <>
      <h2>open console panel</h2>

      <h3>account</h3>
      <ul>
        <li>
          <button
            onClick={async () => {
              if (!address) return;

              const account = await client.account.getAccount(address);

              console.log('account', account);
            }}
          >
            get account
          </button>
        </li>
      </ul>

      <h3>tx</h3>
      <ul>
        <li>
          <button
            onClick={async () => {
              const gasfeeList = await client.gashub.getMsgGasParams({
                msgTypeUrls: [],
                pagination: {
                  countTotal: true,
                  key: Uint8Array.from([]),
                  limit: Long.fromInt(10),
                  offset: Long.fromInt(0),
                  reverse: false,
                },
              });

              console.log('gasfeeList', gasfeeList);
            }}
          >
            get gasfeeList
          </button>
        </li>
      </ul>

      <h3>sp</h3>
      <ul>
        <li>
          <button
            onClick={async () => {
              const res = await client.sp.getStorageProviders();
              console.log('res', res);
            }}
          >
            get storage providers
          </button>
        </li>
        <li>
          <button
            onClick={async () => {
              const res = await client.sp.getSPUrlByBucket('dfggdf');
              console.log('res', res);
            }}
          >
            getSPUrlByBucket
          </button>
        </li>
        <li>
          <button
            onClick={async () => {
              const res = await client.bucket.listBucketsByIds({
                ids: ['1', '2'],
              });
              console.log('res', res);
            }}
          >
            get buckets by ids
          </button>
        </li>
        <li>
          <button
            onClick={async () => {
              const res = await client.object.listObjectsByIds({
                ids: ['1', '2'],
              });
              console.log('res', res);
            }}
          >
            get objects by ids
          </button>
        </li>
        <li>
          <button
            onClick={async () => {
              if (!address) return;

              const res = await client.sp.verifyPermission({
                action: 'ACTION_DELETE_OBJECT',
                bucketName: 'foo',
                operator: address,
                objectName: 'bar2.+_-~/fd(){}',
              });
              console.log('res', res);
            }}
          >
            verify permission
          </button>
        </li>
        <li>
          <button
            onClick={async () => {
              if (!address) return;

              const res = await client.sp.listGroupsMembers({
                groupId: 269,
              });

              console.log('res', res);
            }}
          >
            list groups members
          </button>
        </li>
        <li>
          <button
            onClick={async () => {
              if (!address) return;

              const res = await client.sp.listUserGroups({
                address,
                limit: 10,
                startAfter: '0',
              });

              console.log('res', res);
            }}
          >
            list user groups
          </button>
        </li>
        <li>
          <button
            onClick={async () => {
              if (!address) return;

              const res = await client.sp.listUserOwnedGroups({
                address,
                limit: 10,
                startAfter: '0',
              });

              console.log('res', res);
            }}
          >
            list user owned groups
          </button>
        </li>
      </ul>
    </>
  );
};
