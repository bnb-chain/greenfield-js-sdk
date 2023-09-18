export type SpResponse<T> = {
  code: number | string;
  xml?: Document;
  message?: string;
  statusCode?: number;
  body?: T;
  signedMsg?: object;
};
