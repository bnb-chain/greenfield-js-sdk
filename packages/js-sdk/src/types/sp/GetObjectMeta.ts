import { ObjectMeta } from './Common';

export interface GetObjectMetaRequest {
  bucketName: string;
  objectName: string;
  endpoint: string;
}

export interface GetObjectMetaResponse {
  GfSpGetObjectMetaResponse: GfSPGetObjectMetaResponse;
}

export interface GfSPGetObjectMetaResponse {
  Object: ObjectMeta;
}
