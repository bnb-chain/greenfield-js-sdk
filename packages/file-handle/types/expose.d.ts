export type THashResult = {
  contentLength: number;
  expectCheckSums: string[];
  fileChunks: number;
};

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

export async function generateCheckSumV2(file: File): Promise<THashResult>;

export function getCheckSumsWorker(): generateCheckSumV2;
