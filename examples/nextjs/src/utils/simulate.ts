import { ethers } from 'ethers';

export const getRelayFeeBySimulate = (
  transferOutRelayerFee: string,
  transferOutAckRelayerFee: string,
) => {
  const relayFee = ethers.utils.parseUnits(transferOutRelayerFee, 0);
  const ackFee = ethers.utils.parseUnits(transferOutAckRelayerFee, 0);

  const total = relayFee.add(ackFee);

  return ethers.utils.formatUnits(total, 18);
};
