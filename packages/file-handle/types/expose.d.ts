export function getCheckSums(
  bytes: Uint8Array,
  segmentSize?: number,
  dataBlocks?: number,
  parityBlocks?: number,
): Promise<{
  expectCheckSums: string;
  contentLength: number;
  redundancyVal: number;
}>;
