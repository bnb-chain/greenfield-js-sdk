import { ResourceType } from '@bnb-chain/greenfield-cosmos-types/greenfield/resource/types';

// GRN define a standard ResourceName format, full name: GreenFieldResourceName
// valid format:
//	bucket: "grn:b::bucketName"
//	object: "grn:o::bucketName/objectName"
//	group: "grn:g:ownerAddress/groupName"
// Notice: all the name support wildcards

export interface IGRN {
  resType: ResourceType;
  groupOwner: string;
  /**
   * can be bucketName, bucketName/objectName, groupName
   */
  name: string;
}

const BucketTypeAbbr = 'b';
const ObjectTypeAbbr = 'o';
const GroupTypeAbbr = 'g';

export const newBucketGRN = (bucketName: string): IGRN => {
  return {
    resType: ResourceType.RESOURCE_TYPE_BUCKET,
    groupOwner: '',
    name: bucketName,
  };
};

export const newObjectGRN = (owner: string, groupName: string): IGRN => {
  return {
    resType: ResourceType.RESOURCE_TYPE_GROUP,
    groupOwner: owner,
    name: groupName,
  };
};

export const GRNToString = (grn: IGRN) => {
  let res = '';

  switch (grn.resType) {
    case ResourceType.RESOURCE_TYPE_BUCKET:
      res = `grn:${BucketTypeAbbr}::${grn.name}`;
      break;
    case ResourceType.RESOURCE_TYPE_OBJECT:
      res = `grn:${ObjectTypeAbbr}::${grn.name}`;
      break;
    case ResourceType.RESOURCE_TYPE_GROUP:
      res = `grn:${GroupTypeAbbr}:${grn.groupOwner}:${grn.name}`;
      break;
    default:
      return '';
  }

  return res.trim();
};
