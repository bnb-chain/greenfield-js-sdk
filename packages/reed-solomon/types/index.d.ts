declare module '@bnb-chain/reed-solomon' {
  export type EncodeShard = {
    index: number;
    segChecksum: Uint8Array;
    encodeDataHash: Uint8Array[];
  };

  export class ReedSolomon {
    constructor(dataShards = 4, parityShards = 2, segmentSize = 16777216);

    encodeSegment(data: Uint8Array): Uint8Array[];

    encode(data: Uint8Arary): string[];

    getEncodeShard(chunk: Uint8Array, index: number): EncodeShard;

    getChecksumsByEncodeShards(encodeShards: EncodeShard[]): string[];
  }
}
