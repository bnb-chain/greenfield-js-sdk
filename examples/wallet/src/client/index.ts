import { GREEN_CHAIN_ID, GRPC_URL } from '@/config';
import { ChainClient, makeRpcClient } from '@bnb-chain/greenfield-chain-sdk';
import Long from 'long';
import { QueryClientImpl as spQueryClientImpl } from '@bnb-chain/greenfield-cosmos-types/greenfield/sp/query';
import { QueryClientImpl as storageQueryClientImpl } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/query';

export const client = ChainClient.create(GRPC_URL, String(GREEN_CHAIN_ID));

export const getSpStoragePriceByTime = async () => {
  const rpcClient = await makeRpcClient(GRPC_URL);

  const rpc = new spQueryClientImpl(rpcClient);
  const res = await rpc.QueryGetSpStoragePriceByTime({
    spAddr: '0xA4187E64dD484ce8Fe102bfAf498c884Df37cF7b',
    timestamp: Long.fromNumber(1678772331382),
  });
  return res;
};

export const getStorageProviders = async () => {
  const rpcClient = await makeRpcClient(GRPC_URL);

  const rpc = new spQueryClientImpl(rpcClient);
  const res = await rpc.StorageProviders({
    pagination: undefined,
  });
  console.log(res.sps.map((t) => t.operatorAddress));
  return res;
};

export const getBucketInfo = async (rpcUrl: string, bucketName: string) => {
  const rpcClient = await makeRpcClient(rpcUrl);

  const rpc = new storageQueryClientImpl(rpcClient);
  const bucketInfoRes = await rpc.HeadBucket({
    bucketName,
  });

  const bucketId = bucketInfoRes?.bucketInfo?.id;
  if (!bucketId) throw new Error('no such bucket');

  return await rpc.HeadBucketById({
    bucketId,
  });
};

export const getObjectInfo = async (rpcUrl: string, bucketName: string, objectName: string) => {
  const rpcClient = await makeRpcClient(rpcUrl);
  const rpc = new storageQueryClientImpl(rpcClient);
  const objInfoRes = await rpc.HeadObject({
    bucketName,
    objectName,
  });

  const objectId = objInfoRes?.objectInfo?.id;
  if (!objectId) throw new Error('no such object');

  return await rpc.HeadObjectById({
    objectId,
  });
};
