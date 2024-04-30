import { getCrossClientConfig } from '@/client/cross';
import {
  BUCKETHUB_ADDRESS,
  CROSSCHAIN_ADDRESS,
  EXECUTOR_ADDRESS,
  GROUPHUB_ADDRESS,
  MULTIMESSAGE_ADDRESS,
  OBJECTHUB_ADDRESS,
  PERMISSIONHUB_ADDRESS,
  TOKENHUB_ADDRESS,
} from '@/config';
import {
  CrossChainClient,
  ExecutorClient,
  ExecutorMsg,
  MultiMessageClient,
} from '@bnb-chain/bsc-cross-greenfield-sdk';
import { useAccount } from 'wagmi';

export const MultiMessage = () => {
  const { address } = useAccount();

  return (
    <div>
      <h3>multi message</h3>
      <button
        onClick={async () => {
          if (!address) return;

          const config = getCrossClientConfig(address);

          const crossChainClient = new CrossChainClient(config, CROSSCHAIN_ADDRESS);

          const { relayFee, minAckRelayFee } = await crossChainClient.getRelayFee();

          console.log('fees: ', relayFee, minAckRelayFee);

          const mutliMsgClient = new MultiMessageClient(config, MULTIMESSAGE_ADDRESS, {
            bucketHubAddress: BUCKETHUB_ADDRESS,
            objectHubAddress: OBJECTHUB_ADDRESS,
            groupHubAddress: GROUPHUB_ADDRESS,
            permissionHubAddress: PERMISSIONHUB_ADDRESS,
            tokenHubAddress: TOKENHUB_ADDRESS,
          });

          const args = mutliMsgClient.deleteBucket(
            {
              id: BigInt(180013),
            },
            {
              sender: address,
              minAckRelayFee,
              relayFee,
            },
          );

          const txHash = await mutliMsgClient.sendMessages([args]);

          console.log('txHash', txHash);
        }}
      >
        click
      </button>

      <h3>executor</h3>

      <button
        onClick={async () => {
          if (!address) return;

          const config = getCrossClientConfig(address);

          const crossChainClient = new CrossChainClient(config, CROSSCHAIN_ADDRESS);

          const { relayFee, minAckRelayFee } = await crossChainClient.getRelayFee();

          console.log('fees: ', relayFee, minAckRelayFee);

          const executorClient = new ExecutorClient(config, EXECUTOR_ADDRESS);

          const params = ExecutorMsg.getCreatePaymentAccountParams({
            creator: address,
          });

          const txHash = await executorClient.execute([params], { relayFee });

          console.log('txHash', txHash);
        }}
      >
        click
      </button>
    </div>
  );
};
