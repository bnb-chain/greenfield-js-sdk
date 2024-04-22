import { expect } from '@jest/globals';
import { CrossChainClient } from '../src/client/cross-chain';
import { BasicClientParams } from '../src/types';
import { ACCOUNT_PRIVATEKEY, CrossChainAddress } from './env';

describe('base', () => {
  let crossChainClient: CrossChainClient;

  beforeEach(() => {
    const config: BasicClientParams = {
      chainConfig: 'testnet',
      accountConfig: {
        privateKey: ACCOUNT_PRIVATEKEY,
      },
    };

    crossChainClient = new CrossChainClient(config, CrossChainAddress);
  });

  test('getCallbackGasPrice', async () => {
    const gasPrice = await crossChainClient.getCallbackGasPrice();

    // eslint-disable-next-line no-console
    console.log('gasPrice', gasPrice);

    expect(gasPrice).toBeDefined();
  });

  test('getCallbackGasPrice', async () => {
    const realyFee = await crossChainClient.getRelayFee();

    // eslint-disable-next-line no-console
    console.log('realyFee', realyFee);

    expect(realyFee).toBeDefined();
  });
});
