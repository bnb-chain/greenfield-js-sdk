declare module '@bnb-chain/reed-solomon/web.adapter' {
  export class WebAdapterReedSolomon {
    initWorkers(workersOpts: { workerNum?: number; injectWorker: () => void }): void;

    encodeInWorker(data: Uint8Array): Promise<string[]>;
  }
}
