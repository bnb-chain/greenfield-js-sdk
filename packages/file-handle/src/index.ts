const DEFAULT_SEGMENT_SIZE = 16 * 1024 * 1024;
const DEFAULT_DATA_BLOCKS = 4;
const DEFAULT_PARITY_BLOCKS = 2;

export class FileHandler {
  static async getPieceHashRoots(
    bytes: Uint8Array,
    segmentSize = DEFAULT_SEGMENT_SIZE,
    dataBlocks = DEFAULT_DATA_BLOCKS,
    parityBlocks = DEFAULT_PARITY_BLOCKS,
  ) {
    try {
      const { GreenfieldWasmSdk } = await import('./files-handle-wasm/web.js');
      const g = await GreenfieldWasmSdk();
      const hashResult = await g.getCheckSums(bytes, segmentSize, dataBlocks, parityBlocks);
      const { contentLength, expectCheckSums } = hashResult;
      return {
        contentLength,
        expectCheckSums: JSON.parse(expectCheckSums),
      };
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
