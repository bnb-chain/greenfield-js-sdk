declare module '@bnb-chain/reed-solomon' {
  export class ReedSolomon {
    constructor(dataShards = 4, parityShards = 2, segmentSize = 16777216);

    encodeSegment(data: Uint8Array): Uint8Array[];

    encode(data: Uint8Arary): string[];
  }
}

// declare class NodeAdapterReedSolomon {
//   encodeInWorker(p: string, data: Uint8Array): Promise<string[]>;
// }
