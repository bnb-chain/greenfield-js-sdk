import { SimulateResponse } from '@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/service';
import { bytesFromBase64 } from '@bnb-chain/greenfield-cosmos-types/helpers';
import { formatEther } from '@ethersproject/units';
import { ISimulateGasFee, Long } from '..';

export const getGasFeeBySimulate = (
  simulateTxInfo: SimulateResponse,
  denom = 'BNB',
): ISimulateGasFee => {
  if (!simulateTxInfo.gasInfo) throw new Error('gasInfo not found');

  const gasLimit = BigInt(simulateTxInfo.gasInfo?.gasUsed.toNumber());
  const gasPrice = simulateTxInfo.gasInfo?.minGasPrice.replace(denom, '');
  const gasFee = gasLimit * BigInt(gasPrice);

  return {
    gasLimit,
    gasPrice,
    gasFee: formatEther(String(gasFee)),
  };
};

export const getApproval = (expiredHeight: string, sig: string) => {
  return {
    expiredHeight: Long.fromString(expiredHeight),
    sig: bytesFromBase64(sig),
  };
};
