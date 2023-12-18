declare module '@bnb-chain/reed-solomon/utils' {
  export function concat(a: Uint8Array[], b: Uint8Array[]): Uint8Array[];

  export function getIntegrityUint8Array(uin8arr: Uint8Array[]): Uint8Array;

  export function toBase64(hashList: Uint8Array[]): string[];

  export function splitPrice(data: Uint8Array, size: number): Uint8Array[];
}
