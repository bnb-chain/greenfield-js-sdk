declare module '@bnb-chain/reed-solomon/node.adapter' {
  export class NodeAdapterReedSolomon {
    encodeInWorker(p: string, data: Uint8Array): Promise<string[]>;
  }
}
