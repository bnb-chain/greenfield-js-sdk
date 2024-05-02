// https://github.com/bnb-chain/greenfield-contracts/blob/develop/contracts/interface/IMultiMessage.sol
export const MultiMessageAbi = [
  'function sendMessages(address[] calldata _targets, bytes[] calldata _data,uint256[] calldata _values) external payable returns (bool)',
] as const;
