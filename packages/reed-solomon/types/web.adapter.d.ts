declare module '@bnb-chain/reed-solomon/web.adapter' {
  export class WebAdapterReedSolomon {
    encodeInWorker(
      workerFn: () => void,
      data: Uint8Array,
      cdnUrls: {
        webAdapterUrl: string;
        utilsUrl: string;
      },
    ): Promise<string[]>;
  }

  export function injectWorker(cdnsUrls?: { webAdapterUrl: string; utilsUrl: string }): void;
}
