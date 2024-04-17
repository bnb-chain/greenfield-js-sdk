import { client, selectSp } from '@/client';
import { getOffchainAuthKeys } from '@/utils/offchainAuth';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ReedSolomon } from '@bnb-chain/reed-solomon';
import {
  bytesFromBase64,
  Long,
  RedundancyType,
  VisibilityType,
} from '@bnb-chain/greenfield-js-sdk';

export const Demo = () => {
  const { address, connector } = useAccount();
  const [info, setInfo] = useState<{
    bucketName: string;
    objectName: string;
    file: File | null;
  }>({
    bucketName: '',
    objectName: '',
    file: null,
  });
  const [txnHash, setTxnHash] = useState('');

  return (
    <>
      <section className="section">
        <div className="container">
          <h1 className="title">Greenfield Storage Demo</h1>
          <p className="subtitle">Create Bucket / Create Object / Upload File / Download File</p>
        </div>
      </section>

      <div className="box">
        <button
          className="button is-primary"
          onClick={async () => {
            const latestBlockHeight = await client.basic.getLatestBlockHeight();

            alert(JSON.stringify(latestBlockHeight));
          }}
        >
          getLatestBlockHeight
        </button>
      </div>

      <div className="box">
        <button
          className="button is-primary"
          onClick={async () => {
            if (!address) return;

            const balance = await client.account.getAccountBalance({
              address: address,
              denom: 'BNB',
            });

            alert(JSON.stringify(balance));
          }}
        >
          getAccountBalance
        </button>
      </div>

      <div className="box">
        <button
          className="button is-primary"
          onClick={async () => {
            if (!address) return;

            const transferTx = await client.account.transfer({
              fromAddress: address,
              toAddress: '0x0000000000000000000000000000000000000000',
              amount: [
                {
                  denom: 'BNB',
                  amount: '1000000000',
                },
              ],
            });

            const simulateInfo = await transferTx.simulate({
              denom: 'BNB',
            });

            const res = await transferTx.broadcast({
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
              alert('transfer success!!');
            }
          }}
        >
          transfer
        </button>
      </div>

      <div className="box">
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Bucket</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={info.bucketName}
                  placeholder="bucket name"
                  onChange={(e) => {
                    setInfo({ ...info, bucketName: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="field">
          <button
            className={'button is-primary'}
            onClick={async () => {
              if (!address) return;

              const spInfo = await selectSp();
              console.log('spInfo', spInfo);

              const provider = await connector?.getProvider();
              const offChainData = await getOffchainAuthKeys(address, provider);
              if (!offChainData) {
                alert('No offchain, please create offchain pairs first');
                return;
              }

              try {
                const createBucketTx = await client.bucket.createBucket({
                  bucketName: info.bucketName,
                  creator: address,
                  visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
                  chargedReadQuota: Long.fromString('0'),
                  primarySpAddress: spInfo.primarySpAddress,
                  paymentAddress: address,
                });

                const simulateInfo = await createBucketTx.simulate({
                  denom: 'BNB',
                });

                console.log('simulateInfo', simulateInfo);

                const res = await createBucketTx.broadcast({
                  denom: 'BNB',
                  gasLimit: Number(simulateInfo?.gasLimit),
                  gasPrice: simulateInfo?.gasPrice || '5000000000',
                  payer: address,
                  granter: '',
                });

                if (res.code === 0) {
                  alert('success');
                }
              } catch (err) {
                console.log(typeof err);
                if (err instanceof Error) {
                  alert(err.message);
                }
                if (err && typeof err === 'object') {
                  alert(JSON.stringify(err));
                }
              }
            }}
          >
            Create Bucket Tx
          </button>
        </div>
      </div>

      <div className="box">
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Object</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={info.objectName}
                  placeholder="object name"
                  onChange={(e) => {
                    setInfo({ ...info, objectName: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="field is-horizontal">
          <div className="file">
            <label className="file-label">
              <input
                className="file-input"
                type="file"
                name="resume"
                onChange={(e) => {
                  if (e.target.files) {
                    setInfo({
                      ...info,
                      file: e.target.files[0],
                    });
                  }
                }}
              />
              <span className="file-cta">
                <span className="file-icon">
                  <i className="fas fa-upload"></i>
                </span>
                <span className="file-label">Choose a file…</span>
              </span>
            </label>
          </div>
        </div>

        {/* create object */}
        <div className="field">
          <button
            className="button is-primary"
            onClick={async () => {
              if (!address || !info.file) return;

              const provider = await connector?.getProvider();
              const offChainData = await getOffchainAuthKeys(address, provider);
              if (!offChainData) {
                alert('No offchain, please create offchain pairs first');
                return;
              }

              const rs = new ReedSolomon();
              const fileBytes = await info.file.arrayBuffer();
              const expectCheckSums = rs.encode(new Uint8Array(fileBytes));

              try {
                const createObjectTx = await client.object.createObject({
                  bucketName: info.bucketName,
                  objectName: info.objectName,
                  creator: address,
                  visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
                  contentType: info.file.type,
                  redundancyType: RedundancyType.REDUNDANCY_EC_TYPE,
                  payloadSize: Long.fromInt(fileBytes.byteLength),
                  expectChecksums: expectCheckSums.map((x) => bytesFromBase64(x)),
                });

                const simulateInfo = await createObjectTx.simulate({
                  denom: 'BNB',
                });

                console.log('simulateInfo', simulateInfo);

                const res = await createObjectTx.broadcast({
                  denom: 'BNB',
                  gasLimit: Number(simulateInfo?.gasLimit),
                  gasPrice: simulateInfo?.gasPrice || '5000000000',
                  payer: address,
                  granter: '',
                });

                if (res.code === 0) {
                  setTxnHash(res.transactionHash);
                  alert('create object success');
                }
              } catch (err) {
                console.log(typeof err);
                if (err instanceof Error) {
                  alert(err.message);
                }
                if (err && typeof err === 'object') {
                  alert(JSON.stringify(err));
                }
              }
            }}
          >
            Create Object Tx
          </button>
        </div>

        {/* upload */}
        <div className="field">
          <button
            disabled={txnHash === ''}
            className="button is-primary"
            onClick={async () => {
              if (!address || !info.file) return;

              const provider = await connector?.getProvider();
              const offChainData = await getOffchainAuthKeys(address, provider);
              if (!offChainData) {
                alert('No offchain, please create offchain pairs first');
                return;
              }

              const uploadRes = await client.object.uploadObject(
                {
                  bucketName: info.bucketName,
                  objectName: info.objectName,
                  body: info.file,
                  txnHash: txnHash,
                },
                {
                  type: 'EDDSA',
                  domain: window.location.origin,
                  seed: offChainData.seedString,
                  address,
                },
              );

              if (uploadRes.code === 0) {
                alert('success');
              }
            }}
          >
            Upload
          </button>
        </div>

        {/* Download */}
        <div className="field">
          <button
            className="button is-primary"
            onClick={async () => {
              if (!address) return;

              const provider = await connector?.getProvider();
              const offChainData = await getOffchainAuthKeys(address, provider);
              if (!offChainData) {
                alert('No offchain, please create offchain pairs first');
                return;
              }

              const res = await client.object.downloadFile(
                {
                  bucketName: info.bucketName,
                  objectName: info.objectName,
                },
                {
                  type: 'EDDSA',
                  address,
                  domain: window.location.origin,
                  seed: offChainData.seedString,
                },
              );

              console.log(res);
            }}
          >
            Download
          </button>
        </div>

        {/* Update Object Info */}
        <div className="field">
          <button
            className="button is-primary"
            onClick={async () => {
              if (!address) return;

              const provider = await connector?.getProvider();
              const offChainData = await getOffchainAuthKeys(address, provider);
              if (!offChainData) {
                alert('No offchain, please create offchain pairs first');
                return;
              }

              const tx = await client.object.updateObjectInfo({
                bucketName: info.bucketName,
                objectName: info.objectName,
                operator: address,
                visibility: 1,
              });

              const simulateTx = await tx.simulate({
                denom: 'BNB',
              });

              const res = await tx.broadcast({
                denom: 'BNB',
                gasLimit: Number(simulateTx?.gasLimit),
                gasPrice: simulateTx?.gasPrice || '5000000000',
                payer: address,
                granter: '',
              });

              if (res.code === 0) {
                alert('update object info success');
              }
            }}
          >
            Update Object Info
          </button>
        </div>

        {/* Delete object */}
        <div className="field">
          <button
            className="button is-primary"
            onClick={async () => {
              if (!address) return;

              const provider = await connector?.getProvider();
              const offChainData = await getOffchainAuthKeys(address, provider);
              if (!offChainData) {
                alert('No offchain, please create offchain pairs first');
                return;
              }

              const tx = await client.object.deleteObject({
                bucketName: info.bucketName,
                objectName: info.objectName,
                operator: address,
              });

              const simulateTx = await tx.simulate({
                denom: 'BNB',
              });

              const res = await tx.broadcast({
                denom: 'BNB',
                gasLimit: Number(simulateTx?.gasLimit),
                gasPrice: simulateTx?.gasPrice || '5000000000',
                payer: address,
                granter: '',
              });

              if (res.code === 0) {
                alert('delete object info success');
              }
            }}
          >
            Delete Object Info
          </button>
        </div>
      </div>
    </>
  );
};
