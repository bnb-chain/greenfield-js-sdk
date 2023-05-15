import { SimulateResponse } from '@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/service';
import { QueryParamsResponse } from '@bnb-chain/greenfield-cosmos-types/greenfield/bridge/query';
import { ethers } from 'ethers';

export const getGasFeeBySimulate = (simulateTxInfo: SimulateResponse) => {
  if (!simulateTxInfo.gasInfo) throw new Error('gasInfo not found');

  const gasLimit = simulateTxInfo.gasInfo?.gasUsed.toNumber();
  const gasPrice = simulateTxInfo.gasInfo?.minGasPrice.replaceAll('BNB', '');
  const gasFee = gasLimit * parseInt(gasPrice);

  return ethers.utils.formatEther(String(gasFee));
};

export const getRelayFeeBySimulate = (simulateRelayFeeInfo: QueryParamsResponse) => {
  if (!simulateRelayFeeInfo.params) return '0';

  const { transferOutRelayerFee, transferOutAckRelayerFee } = simulateRelayFeeInfo.params;

  const relayFee = ethers.utils.parseUnits(transferOutRelayerFee, 0);
  const ackFee = ethers.utils.parseUnits(transferOutAckRelayerFee, 0);

  const total = relayFee.add(ackFee);

  return ethers.utils.formatUnits(total, 18);
};
