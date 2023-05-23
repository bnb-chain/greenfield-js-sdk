export const MsgMirrorGroupSDKTypeEIP712 = {
  Msg: [
    {
      type: 'string',
      name: 'type',
    },
    {
      type: 'string',
      name: 'creator',
    },
    {
      type: 'string',
      name: 'bucket_name',
    },
    {
      type: 'string',
      name: 'visibility',
    },
    {
      type: 'string',
      name: 'payment_address',
    },
    {
      type: 'string',
      name: 'primary_sp_address',
    },
    {
      type: 'TypePrimarySpApproval',
      name: 'primary_sp_approval',
    },
    {
      type: 'uint64',
      name: 'charged_read_quota',
    },
    {
      type: 'string',
      name: 'operator',
    },
    {
      type: 'string',
      name: 'bucket_name',
    },
    {
      type: 'string',
      name: 'operator',
    },
    {
      type: 'string',
      name: 'bucket_name',
    },
    {
      type: 'string',
      name: 'reason',
    },
    {
      type: 'string',
      name: 'creator',
    },
    {
      type: 'string',
      name: 'bucket_name',
    },
    {
      type: 'string',
      name: 'object_name',
    },
    {
      type: 'uint64',
      name: 'payload_size',
    },
    {
      type: 'string',
      name: 'visibility',
    },
    {
      type: 'string',
      name: 'content_type',
    },
    {
      type: 'TypePrimarySpApproval',
      name: 'primary_sp_approval',
    },
    {
      type: 'Uint8Array[]',
      name: 'expect_checksums',
    },
    {
      type: 'string',
      name: 'redundancy_type',
    },
    {
      type: 'string[]',
      name: 'expect_secondary_sp_addresses',
    },
    {
      type: 'string',
      name: 'operator',
    },
    {
      type: 'string',
      name: 'bucket_name',
    },
    {
      type: 'string',
      name: 'object_name',
    },
    {
      type: 'string[]',
      name: 'secondary_sp_addresses',
    },
    {
      type: 'Uint8Array[]',
      name: 'secondary_sp_signatures',
    },
    {
      type: 'string',
      name: 'operator',
    },
    {
      type: 'string',
      name: 'bucket_name',
    },
    {
      type: 'string',
      name: 'object_name',
    },
    {
      type: 'string',
      name: 'operator',
    },
    {
      type: 'string',
      name: 'src_bucket_name',
    },
    {
      type: 'string',
      name: 'dst_bucket_name',
    },
    {
      type: 'string',
      name: 'src_object_name',
    },
    {
      type: 'string',
      name: 'dst_object_name',
    },
    {
      type: 'TypeDstPrimarySpApproval',
      name: 'dst_primary_sp_approval',
    },
    {
      type: 'string',
      name: 'operator',
    },
    {
      type: 'string',
      name: 'bucket_name',
    },
    {
      type: 'string',
      name: 'object_name',
    },
    {
      type: 'string',
      name: 'operator',
    },
    {
      type: 'string',
      name: 'bucket_name',
    },
    {
      type: 'string[]',
      name: 'object_ids',
    },
    {
      type: 'string',
      name: 'reason',
    },
    {
      type: 'string',
      name: 'creator',
    },
    {
      type: 'string',
      name: 'group_name',
    },
    {
      type: 'string[]',
      name: 'members',
    },
    {
      type: 'string',
      name: 'operator',
    },
    {
      type: 'string',
      name: 'group_name',
    },
    {
      type: 'string',
      name: 'operator',
    },
    {
      type: 'string',
      name: 'group_owner',
    },
    {
      type: 'string',
      name: 'group_name',
    },
    {
      type: 'string[]',
      name: 'members_to_add',
    },
    {
      type: 'string[]',
      name: 'members_to_delete',
    },
    {
      type: 'string',
      name: 'member',
    },
    {
      type: 'string',
      name: 'group_owner',
    },
    {
      type: 'string',
      name: 'group_name',
    },
    {
      type: 'string',
      name: 'operator',
    },
    {
      type: 'string',
      name: 'bucket_name',
    },
    {
      type: 'TypeChargedReadQuota',
      name: 'charged_read_quota',
    },
    {
      type: 'string',
      name: 'payment_address',
    },
    {
      type: 'string',
      name: 'visibility',
    },
    {
      type: 'string',
      name: 'operator',
    },
    {
      type: 'string',
      name: 'bucket_name',
    },
    {
      type: 'string',
      name: 'object_name',
    },
    {
      type: 'string',
      name: 'operator',
    },
    {
      type: 'TypePrincipal',
      name: 'principal',
    },
    {
      type: 'string',
      name: 'resource',
    },
    {
      type: 'StatementSDKType[]',
      name: 'statements',
    },
    {
      type: 'TypeExpirationTime',
      name: 'expiration_time',
    },
    {
      type: 'string',
      name: 'operator',
    },
    {
      type: 'TypePrincipal',
      name: 'principal',
    },
    {
      type: 'string',
      name: 'resource',
    },
    {
      type: 'string',
      name: 'operator',
    },
    {
      type: 'string',
      name: 'id',
    },
    {
      type: 'string',
      name: 'operator',
    },
    {
      type: 'string',
      name: 'id',
    },
    {
      type: 'string',
      name: 'operator',
    },
    {
      type: 'string',
      name: 'bucket_name',
    },
    {
      type: 'string',
      name: 'object_name',
    },
    {
      type: 'string',
      name: 'visibility',
    },
    {
      type: 'string',
      name: 'operator',
    },
    {
      type: 'string',
      name: 'id',
    },
  ],
  TypePrimarySpApproval: [
    {
      type: 'uint64',
      name: 'expired_height',
    },
    {
      type: 'bytes',
      name: 'sig',
    },
  ],
  TypeDstPrimarySpApproval: [
    {
      type: 'uint64',
      name: 'expired_height',
    },
    {
      type: 'bytes',
      name: 'sig',
    },
  ],
  TypeChargedReadQuota: [
    {
      type: 'uint64',
      name: 'value',
    },
  ],
  TypePrincipal: [
    {
      name: 'type',
    },
    {
      type: 'string',
      name: 'value',
    },
  ],
  TypeExpirationTime: [
    {
      type: 'uint64',
      name: 'seconds',
    },
    {
      type: 'uint64',
      name: 'nanos',
    },
  ],
};
