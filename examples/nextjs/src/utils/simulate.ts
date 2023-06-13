import { formatUnits, parseUnits } from 'viem';

export const getRelayFeeBySimulate = (
  transferOutRelayerFee: string,
  transferOutAckRelayerFee: string,
) => {
  const relayFee = parseUnits(`${Number(BigInt(transferOutRelayerFee))}`, 0);
  const ackFee = parseUnits(`${Number(BigInt(transferOutAckRelayerFee))}`, 0);

  const total = relayFee + ackFee;

  return formatUnits(total, 18);
};
