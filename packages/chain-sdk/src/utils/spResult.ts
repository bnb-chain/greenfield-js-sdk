export class SpResult {
  constructor(public txHash: string, public txType: string, public msg: string) {
    this.txHash = txHash;
    this.msg = msg;
    this.txType = txType;
  }

  public static fail(txHash: string, txType: string, msg: string): SpResult {
    return new SpResult(txHash, txType, msg);
  }

  public static success(txHash: string, txType: string, msg: string): SpResult {
    return new SpResult(txHash, txType, msg);
  }
}
