declare module '@bnb-chain/reed-solomon/web.adapter' {
  export class WebAdapterReedSolomon {
    encodeInWorker(workerFn: () => void, data: Uint8Array): Promise<string[]>;
  }
}
