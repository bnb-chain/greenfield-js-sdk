## Bucket API

### select sp

```js
const sps = await client.sp.getStorageProviders();
const finalSps = (sps ?? []).filter((v: any) => v?.description?.moniker !== 'QATest');
const selectIndex = 0;
const secondarySpAddresses = [
  ...finalSps.slice(0, selectIndex),
  ...finalSps.slice(selectIndex + 1),
].map((item) => item.operatorAddress);
```

### putBucketPolicy

```js
// `resource` params
const resource = newBucketGRN(bucketName);
msg.resource = GRNToString(resource);
```

