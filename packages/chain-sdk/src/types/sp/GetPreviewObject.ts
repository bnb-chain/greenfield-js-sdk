export type GetPrivewObject = {
  bucketName: string;
  objectName: string;
  duration?: number;
  queryMap: Record<string, string>;
  endpoint?: string;
};
