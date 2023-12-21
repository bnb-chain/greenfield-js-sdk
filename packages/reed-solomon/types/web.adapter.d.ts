declare module '@bnb-chain/reed-solomon/web.adapter' {
  export class WebAdapterReedSolomon {
    encodeInWorker(
      data: Uint8Array,
      workersOpts: {
        workerNum?: number;
        injectWorker: () => void;
      },
    ): Promise<string[]>;
  }
}
