declare class ReedSolomon {
  constructor(dataShards = 4, parityShards = 2, segmentSize = 16777216);

  encodeSegment(data: Uint8Array): Uint8Array[];

  encode(data: Uint8Arary): string[];
}

declare class NodeAdapterReedSolomon {
  encodeInWorker(p: string, data: Uint8Array): Promise<string[]>;
}

export function concat(a: Uint8Array[], b: Uint8Array[]): Uint8Array[];

export function getIntegrityUint8Array(uin8arr: Uint8Array[]): Uint8Array;

export function toBase64(hashList: Uint8Array[]): string[];

export function splitPrice(data: Uint8Array, size: number): Uint8Array[];
