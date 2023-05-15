export function GreenfieldWasmSdk(): Promise<G>;

export interface G {
  getCheckSums: (
    bytes: Uint8Array,
    segmentSize: number,
    dataBlocks: number,
    parityBlocks: number,
  ) => Promise<{
    expectCheckSums: string;
    contentLength: number;
  }>;
}
