import { expect } from 'chai';
import { parseListObjectsByBucketNameResponse } from '../src/clients/spclient/spApis/listObjectsByBucket';
import { parseGetUserBucketsResponse } from '../src/clients/spclient/spApis/getUserBuckets';

describe('parseListObjectsByBucketNameResponse', () => {
  test('parse CommonPrefixes contains 2 element at least', async () => {
    const data = `
<GfSpListObjectsByBucketNameResponse>
  <CommonPrefixes>xxx</CommonPrefixes>
  <CommonPrefixes>yyy</CommonPrefixes>
	<KeyCount>36</KeyCount>
	<MaxKeys>50</MaxKeys>
	<IsTruncated>false</IsTruncated>
	<NextContinuationToken></NextContinuationToken>
	<Name>foo</Name>
	<Prefix></Prefix>
	<Delimiter></Delimiter>
	<ContinuationToken></ContinuationToken>
</GfSpListObjectsByBucketNameResponse>
    `;

    const res = await parseListObjectsByBucketNameResponse(data);

    expect(res.GfSpListObjectsByBucketNameResponse).to.have.deep.property('CommonPrefixes', [
      'xxx',
      'yyy',
    ]);
  });

  test('parse CommonPrefixes contains 1 element', async () => {
    const data = `
<GfSpListObjectsByBucketNameResponse>
  <CommonPrefixes>xxx</CommonPrefixes>
	<KeyCount>36</KeyCount>
	<MaxKeys>50</MaxKeys>
	<IsTruncated>false</IsTruncated>
	<NextContinuationToken></NextContinuationToken>
	<Name>foo</Name>
	<Prefix></Prefix>
	<Delimiter></Delimiter>
	<ContinuationToken></ContinuationToken>
</GfSpListObjectsByBucketNameResponse>
    `;

    const res = await parseListObjectsByBucketNameResponse(data);

    expect(res.GfSpListObjectsByBucketNameResponse).to.have.deep.property('CommonPrefixes', [
      'xxx',
    ]);
  });

  test('parse empty CommonPrefixes', async () => {
    const data = `
<GfSpListObjectsByBucketNameResponse>
	<KeyCount>36</KeyCount>
	<MaxKeys>50</MaxKeys>
	<IsTruncated>false</IsTruncated>
	<NextContinuationToken></NextContinuationToken>
	<Name>foo</Name>
	<Prefix></Prefix>
	<Delimiter></Delimiter>
	<ContinuationToken></ContinuationToken>
</GfSpListObjectsByBucketNameResponse>
    `;

    const res = await parseListObjectsByBucketNameResponse(data);

    expect(res.GfSpListObjectsByBucketNameResponse).to.have.deep.property('CommonPrefixes', []);
  });

  test('parse empty Objects', async () => {
    const data = `
<GfSpListObjectsByBucketNameResponse>
	<KeyCount>36</KeyCount>
	<MaxKeys>50</MaxKeys>
	<IsTruncated>false</IsTruncated>
	<NextContinuationToken></NextContinuationToken>
	<Name>foo</Name>
	<Prefix></Prefix>
	<Delimiter></Delimiter>
	<ContinuationToken></ContinuationToken>
</GfSpListObjectsByBucketNameResponse>
    `;

    const res = await parseListObjectsByBucketNameResponse(data);

    expect(res.GfSpListObjectsByBucketNameResponse).to.have.deep.property('Objects', []);
  });

  test('parse Objects contains 1 element', async () => {
    const data = `
<GfSpListObjectsByBucketNameResponse>
<Objects>
		<ObjectInfo>
			<Owner>0x1C893441AB6c1A75E01887087ea508bE8e07AAae</Owner>
			<Creator>0x1C893441AB6c1A75E01887087ea508bE8e07AAae</Creator>
			<BucketName>true</BucketName>
			<ObjectName>obk</ObjectName>
			<Id>739112</Id>
			<LocalVirtualGroupId>1</LocalVirtualGroupId>
			<PayloadSize>205</PayloadSize>
			<Visibility>1</Visibility>
			<ContentType>application/x-yaml</ContentType>
			<CreateAt>1692971564</CreateAt>
			<ObjectStatus>1</ObjectStatus>
			<RedundancyType>0</RedundancyType>
			<SourceType>0</SourceType>
			<Checksums>a7554caa696d4db8c8ea4500ad2eac6244bca79e3c3193db8cc699a7e89cf341</Checksums>
			<Checksums>b054fd20d637bfa706182288d687f2c0f0ef5afaa4114170bc18699b268e9c28</Checksums>
		</ObjectInfo>
		<LockedBalance>0x0000000000000000000000000000000000000000000000000000000000000000</LockedBalance>
		<Removed>false</Removed>
		<UpdateAt>232480</UpdateAt>
		<DeleteAt>0</DeleteAt>
		<DeleteReason></DeleteReason>
		<Operator>0x8b97D152149309C15B1C339F547a9aca9Bf629D2</Operator>
		<CreateTxHash>0x42d854103bc83359b86b55b8a0452895865c2de1ac51f26d551fca0e2a587214</CreateTxHash>
		<UpdateTxHash>0x704ba83349018ddcdd0774fb4a01e84eda3d32d8577d958cfa272fbcc2892f75</UpdateTxHash>
		<SealTxHash>0x704ba83349018ddcdd0774fb4a01e84eda3d32d8577d958cfa272fbcc2892f75</SealTxHash>
	</Objects>
	<KeyCount>36</KeyCount>
	<MaxKeys>50</MaxKeys>
	<IsTruncated>false</IsTruncated>
	<NextContinuationToken></NextContinuationToken>
	<Name>foo</Name>
	<Prefix></Prefix>
	<Delimiter></Delimiter>
	<ContinuationToken></ContinuationToken>
</GfSpListObjectsByBucketNameResponse>
    `;

    const res = await parseListObjectsByBucketNameResponse(data);

    expect(res.GfSpListObjectsByBucketNameResponse).to.have.deep.property('Objects', [
      {
        ObjectInfo: {
          Owner: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
          Creator: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
          BucketName: 'true',
          ObjectName: 'obk',
          Id: 739112,
          LocalVirtualGroupId: 1,
          PayloadSize: 205,
          Visibility: 1,
          ContentType: 'application/x-yaml',
          CreateAt: 1692971564,
          ObjectStatus: 1,
          RedundancyType: 0,
          SourceType: 0,
          Checksums: [
            'a7554caa696d4db8c8ea4500ad2eac6244bca79e3c3193db8cc699a7e89cf341',
            'b054fd20d637bfa706182288d687f2c0f0ef5afaa4114170bc18699b268e9c28',
          ],
        },
        LockedBalance: '0x0000000000000000000000000000000000000000000000000000000000000000',
        Removed: false,
        UpdateAt: 232480,
        DeleteAt: 0,
        DeleteReason: '',
        Operator: '0x8b97D152149309C15B1C339F547a9aca9Bf629D2',
        CreateTxHash: '0x42d854103bc83359b86b55b8a0452895865c2de1ac51f26d551fca0e2a587214',
        UpdateTxHash: '0x704ba83349018ddcdd0774fb4a01e84eda3d32d8577d958cfa272fbcc2892f75',
        SealTxHash: '0x704ba83349018ddcdd0774fb4a01e84eda3d32d8577d958cfa272fbcc2892f75',
      },
    ]);
  });

  test('parse Objects contains 2 element at least', async () => {
    const data = `
<GfSpListObjectsByBucketNameResponse>
<Objects>
		<ObjectInfo>
			<Owner>0x1C893441AB6c1A75E01887087ea508bE8e07AAae</Owner>
			<Creator>0x1C893441AB6c1A75E01887087ea508bE8e07AAae</Creator>
			<BucketName>foo</BucketName>
			<ObjectName>obk</ObjectName>
			<Id>739112</Id>
			<LocalVirtualGroupId>1</LocalVirtualGroupId>
			<PayloadSize>205</PayloadSize>
			<Visibility>1</Visibility>
			<ContentType>application/x-yaml</ContentType>
			<CreateAt>1692971564</CreateAt>
			<ObjectStatus>1</ObjectStatus>
			<RedundancyType>0</RedundancyType>
			<SourceType>0</SourceType>
			<Checksums>a7554caa696d4db8c8ea4500ad2eac6244bca79e3c3193db8cc699a7e89cf341</Checksums>
			<Checksums>b054fd20d637bfa706182288d687f2c0f0ef5afaa4114170bc18699b268e9c28</Checksums>
		</ObjectInfo>
		<LockedBalance>0x0000000000000000000000000000000000000000000000000000000000000000</LockedBalance>
		<Removed>false</Removed>
		<UpdateAt>232480</UpdateAt>
		<DeleteAt>0</DeleteAt>
		<DeleteReason></DeleteReason>
		<Operator>0x8b97D152149309C15B1C339F547a9aca9Bf629D2</Operator>
		<CreateTxHash>0x42d854103bc83359b86b55b8a0452895865c2de1ac51f26d551fca0e2a587214</CreateTxHash>
		<UpdateTxHash>0x704ba83349018ddcdd0774fb4a01e84eda3d32d8577d958cfa272fbcc2892f75</UpdateTxHash>
		<SealTxHash>0x704ba83349018ddcdd0774fb4a01e84eda3d32d8577d958cfa272fbcc2892f75</SealTxHash>
	</Objects>
  <Objects>
		<ObjectInfo>
			<Owner>0x1C893441AB6c1A75E01887087ea508bE8e07AAae</Owner>
			<Creator>0x1C893441AB6c1A75E01887087ea508bE8e07AAae</Creator>
			<BucketName>foo</BucketName>
			<ObjectName>obk</ObjectName>
			<Id>739112</Id>
			<LocalVirtualGroupId>1</LocalVirtualGroupId>
			<PayloadSize>205</PayloadSize>
			<Visibility>1</Visibility>
			<ContentType>application/x-yaml</ContentType>
			<CreateAt>1692971564</CreateAt>
			<ObjectStatus>1</ObjectStatus>
			<RedundancyType>0</RedundancyType>
			<SourceType>0</SourceType>
			<Checksums>a7554caa696d4db8c8ea4500ad2eac6244bca79e3c3193db8cc699a7e89cf341</Checksums>
			<Checksums>b054fd20d637bfa706182288d687f2c0f0ef5afaa4114170bc18699b268e9c28</Checksums>
		</ObjectInfo>
		<LockedBalance>0x0000000000000000000000000000000000000000000000000000000000000000</LockedBalance>
		<Removed>false</Removed>
		<UpdateAt>232480</UpdateAt>
		<DeleteAt>0</DeleteAt>
		<DeleteReason></DeleteReason>
		<Operator>0x8b97D152149309C15B1C339F547a9aca9Bf629D2</Operator>
		<CreateTxHash>0x42d854103bc83359b86b55b8a0452895865c2de1ac51f26d551fca0e2a587214</CreateTxHash>
		<UpdateTxHash>0x704ba83349018ddcdd0774fb4a01e84eda3d32d8577d958cfa272fbcc2892f75</UpdateTxHash>
		<SealTxHash>0x704ba83349018ddcdd0774fb4a01e84eda3d32d8577d958cfa272fbcc2892f75</SealTxHash>
	</Objects>
	<KeyCount>36</KeyCount>
	<MaxKeys>50</MaxKeys>
	<IsTruncated>false</IsTruncated>
	<NextContinuationToken></NextContinuationToken>
	<Name>foo</Name>
	<Prefix></Prefix>
	<Delimiter></Delimiter>
	<ContinuationToken></ContinuationToken>
</GfSpListObjectsByBucketNameResponse>
    `;

    const res = await parseListObjectsByBucketNameResponse(data);

    expect(res.GfSpListObjectsByBucketNameResponse).to.have.deep.property('Objects', [
      {
        ObjectInfo: {
          Owner: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
          Creator: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
          BucketName: 'foo',
          ObjectName: 'obk',
          Id: 739112,
          LocalVirtualGroupId: 1,
          PayloadSize: 205,
          Visibility: 1,
          ContentType: 'application/x-yaml',
          CreateAt: 1692971564,
          ObjectStatus: 1,
          RedundancyType: 0,
          SourceType: 0,
          Checksums: [
            'a7554caa696d4db8c8ea4500ad2eac6244bca79e3c3193db8cc699a7e89cf341',
            'b054fd20d637bfa706182288d687f2c0f0ef5afaa4114170bc18699b268e9c28',
          ],
        },
        LockedBalance: '0x0000000000000000000000000000000000000000000000000000000000000000',
        Removed: false,
        UpdateAt: 232480,
        DeleteAt: 0,
        DeleteReason: '',
        Operator: '0x8b97D152149309C15B1C339F547a9aca9Bf629D2',
        CreateTxHash: '0x42d854103bc83359b86b55b8a0452895865c2de1ac51f26d551fca0e2a587214',
        UpdateTxHash: '0x704ba83349018ddcdd0774fb4a01e84eda3d32d8577d958cfa272fbcc2892f75',
        SealTxHash: '0x704ba83349018ddcdd0774fb4a01e84eda3d32d8577d958cfa272fbcc2892f75',
      },
      {
        ObjectInfo: {
          Owner: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
          Creator: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
          BucketName: 'foo',
          ObjectName: 'obk',
          Id: 739112,
          LocalVirtualGroupId: 1,
          PayloadSize: 205,
          Visibility: 1,
          ContentType: 'application/x-yaml',
          CreateAt: 1692971564,
          ObjectStatus: 1,
          RedundancyType: 0,
          SourceType: 0,
          Checksums: [
            'a7554caa696d4db8c8ea4500ad2eac6244bca79e3c3193db8cc699a7e89cf341',
            'b054fd20d637bfa706182288d687f2c0f0ef5afaa4114170bc18699b268e9c28',
          ],
        },
        LockedBalance: '0x0000000000000000000000000000000000000000000000000000000000000000',
        Removed: false,
        UpdateAt: 232480,
        DeleteAt: 0,
        DeleteReason: '',
        Operator: '0x8b97D152149309C15B1C339F547a9aca9Bf629D2',
        CreateTxHash: '0x42d854103bc83359b86b55b8a0452895865c2de1ac51f26d551fca0e2a587214',
        UpdateTxHash: '0x704ba83349018ddcdd0774fb4a01e84eda3d32d8577d958cfa272fbcc2892f75',
        SealTxHash: '0x704ba83349018ddcdd0774fb4a01e84eda3d32d8577d958cfa272fbcc2892f75',
      },
    ]);
  });
});

describe('parseGetUserBucketsResponse', () => {
  test('parse Buckets containers 2 element at least', async () => {
    const data = `<GfSpGetUserBucketsResponse>
	<Buckets>
		<BucketInfo>
			<Owner>0x1C893441AB6c1A75E01887087ea508bE8e07AAae</Owner>
			<BucketName>false</BucketName>
			<Visibility>1</Visibility>
			<Id>1156769</Id>
			<SourceType>0</SourceType>
			<CreateAt>1693279149</CreateAt>
			<PaymentAddress>0x1C893441AB6c1A75E01887087ea508bE8e07AAae</PaymentAddress>
			<GlobalVirtualGroupFamilyId>8</GlobalVirtualGroupFamilyId>
			<ChargedReadQuota>0</ChargedReadQuota>
			<BucketStatus>0</BucketStatus>
		</BucketInfo>
		<Removed>false</Removed>
		<DeleteAt>0</DeleteAt>
		<DeleteReason></DeleteReason>
		<Operator>0x1C893441AB6c1A75E01887087ea508bE8e07AAae</Operator>
		<CreateTxHash>0xea5f91a6ba8e558e35ecc416579b4585cc494d5dcc99bce519cc54968b0b1292</CreateTxHash>
		<UpdateTxHash>0xea5f91a6ba8e558e35ecc416579b4585cc494d5dcc99bce519cc54968b0b1292</UpdateTxHash>
		<UpdateAt>363707</UpdateAt>
		<UpdateTime>1693279149</UpdateTime>
	</Buckets>
	<Buckets>
		<BucketInfo>
			<Owner>0x1C893441AB6c1A75E01887087ea508bE8e07AAae</Owner>
			<BucketName>false</BucketName>
			<Visibility>1</Visibility>
			<Id>1156769</Id>
			<SourceType>0</SourceType>
			<CreateAt>1693279149</CreateAt>
			<PaymentAddress>0x1C893441AB6c1A75E01887087ea508bE8e07AAae</PaymentAddress>
			<GlobalVirtualGroupFamilyId>8</GlobalVirtualGroupFamilyId>
			<ChargedReadQuota>0</ChargedReadQuota>
			<BucketStatus>0</BucketStatus>
		</BucketInfo>
		<Removed>false</Removed>
		<DeleteAt>0</DeleteAt>
		<DeleteReason></DeleteReason>
		<Operator>0x1C893441AB6c1A75E01887087ea508bE8e07AAae</Operator>
		<CreateTxHash>0xea5f91a6ba8e558e35ecc416579b4585cc494d5dcc99bce519cc54968b0b1292</CreateTxHash>
		<UpdateTxHash>0xea5f91a6ba8e558e35ecc416579b4585cc494d5dcc99bce519cc54968b0b1292</UpdateTxHash>
		<UpdateAt>363707</UpdateAt>
		<UpdateTime>1693279149</UpdateTime>
	</Buckets>
</GfSpGetUserBucketsResponse>`;

    const res = await parseGetUserBucketsResponse(data);

    expect(res.GfSpGetUserBucketsResponse).to.have.deep.property('Buckets', [
      {
        BucketInfo: {
          Owner: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
          BucketName: 'false',
          Visibility: 1,
          Id: '1156769',
          SourceType: 0,
          CreateAt: 1693279149,
          PaymentAddress: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
          GlobalVirtualGroupFamilyId: 8,
          ChargedReadQuota: 0,
          BucketStatus: 0,
        },
        Removed: false,
        DeleteAt: 0,
        DeleteReason: '',
        Operator: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
        CreateTxHash: '0xea5f91a6ba8e558e35ecc416579b4585cc494d5dcc99bce519cc54968b0b1292',
        UpdateTxHash: '0xea5f91a6ba8e558e35ecc416579b4585cc494d5dcc99bce519cc54968b0b1292',
        UpdateAt: 363707,
        UpdateTime: 1693279149,
      },
      {
        BucketInfo: {
          Owner: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
          BucketName: 'false',
          Visibility: 1,
          Id: '1156769',
          SourceType: 0,
          CreateAt: 1693279149,
          PaymentAddress: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
          GlobalVirtualGroupFamilyId: 8,
          ChargedReadQuota: 0,
          BucketStatus: 0,
        },
        Removed: false,
        DeleteAt: 0,
        DeleteReason: '',
        Operator: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
        CreateTxHash: '0xea5f91a6ba8e558e35ecc416579b4585cc494d5dcc99bce519cc54968b0b1292',
        UpdateTxHash: '0xea5f91a6ba8e558e35ecc416579b4585cc494d5dcc99bce519cc54968b0b1292',
        UpdateAt: 363707,
        UpdateTime: 1693279149,
      },
    ]);
  });

  test('parse Buckets containers 1 element', async () => {
    const data = `<GfSpGetUserBucketsResponse>
	<Buckets>
		<BucketInfo>
			<Owner>0x1C893441AB6c1A75E01887087ea508bE8e07AAae</Owner>
			<BucketName>false</BucketName>
			<Visibility>1</Visibility>
			<Id>1156769</Id>
			<SourceType>0</SourceType>
			<CreateAt>1693279149</CreateAt>
			<PaymentAddress>0x1C893441AB6c1A75E01887087ea508bE8e07AAae</PaymentAddress>
			<GlobalVirtualGroupFamilyId>8</GlobalVirtualGroupFamilyId>
			<ChargedReadQuota>0</ChargedReadQuota>
			<BucketStatus>0</BucketStatus>
		</BucketInfo>
		<Removed>false</Removed>
		<DeleteAt>0</DeleteAt>
		<DeleteReason></DeleteReason>
		<Operator>0x1C893441AB6c1A75E01887087ea508bE8e07AAae</Operator>
		<CreateTxHash>0xea5f91a6ba8e558e35ecc416579b4585cc494d5dcc99bce519cc54968b0b1292</CreateTxHash>
		<UpdateTxHash>0xea5f91a6ba8e558e35ecc416579b4585cc494d5dcc99bce519cc54968b0b1292</UpdateTxHash>
		<UpdateAt>363707</UpdateAt>
		<UpdateTime>1693279149</UpdateTime>
	</Buckets>
</GfSpGetUserBucketsResponse>`;

    const res = await parseGetUserBucketsResponse(data);

    expect(res.GfSpGetUserBucketsResponse).to.have.deep.property('Buckets', [
      {
        BucketInfo: {
          Owner: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
          BucketName: 'false',
          Visibility: 1,
          Id: '1156769',
          SourceType: 0,
          CreateAt: 1693279149,
          PaymentAddress: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
          GlobalVirtualGroupFamilyId: 8,
          ChargedReadQuota: 0,
          BucketStatus: 0,
        },
        Removed: false,
        DeleteAt: 0,
        DeleteReason: '',
        Operator: '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
        CreateTxHash: '0xea5f91a6ba8e558e35ecc416579b4585cc494d5dcc99bce519cc54968b0b1292',
        UpdateTxHash: '0xea5f91a6ba8e558e35ecc416579b4585cc494d5dcc99bce519cc54968b0b1292',
        UpdateAt: 363707,
        UpdateTime: 1693279149,
      },
    ]);
  });

  test('parse empty Buckets', async () => {
    const data = `<GfSpGetUserBucketsResponse></GfSpGetUserBucketsResponse>`;

    const res = await parseGetUserBucketsResponse(data);

    expect(res.GfSpGetUserBucketsResponse).to.have.deep.property('Buckets', []);
  });
});
