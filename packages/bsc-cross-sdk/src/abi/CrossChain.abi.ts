// https://github.com/bnb-chain/greenfield-contracts/blob/develop/contracts/interface/ICrossChain.sol

export const CrossChainABI = [
  'function callbackGasPrice() external returns (uint256)',
  'function getRelayFees() view returns (uint256 relayFee, uint256 minAckRelayFee)',
];
