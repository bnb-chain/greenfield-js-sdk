// https://github.com/bnb-chain/greenfield-contracts/blob/develop/contracts/interface/IGreenfieldExecutor.sol
export const ExecutorABI = [
  'function execute(uint8[] calldata _msgTypes, bytes[] calldata _msgBytes) external payable returns (bool)',
] as const;
