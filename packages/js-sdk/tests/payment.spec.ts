import { describe, expect, test } from '@jest/globals';
import { ACCOUNT_ADDRESS, ACCOUNT_PRIVATEKEY } from './env';
import { client } from './utils';
import { parseEther } from '@ethersproject/units';
import { createFile } from '../src/node/adapter';
import { VisibilityType } from '../src';

const BUCKET_NAME = 'foo_bucket';

describe('payment', () => {
  test('it works', async () => {
    // create payment account
    const createPaymentTx = await client.account.createPaymentAccount({
      creator: ACCOUNT_ADDRESS,
    });

    const createPaymentSimulateInfo = await createPaymentTx.simulate({
      denom: 'BNB',
    });
    const createPaymentRes = await createPaymentTx.broadcast({
      denom: 'BNB',
      gasLimit: Number(createPaymentSimulateInfo?.gasLimit),
      gasPrice: createPaymentSimulateInfo?.gasPrice || '5000000000',
      payer: ACCOUNT_ADDRESS,
      granter: '',
    });
    if (createPaymentRes.code === 0) {
      // eslint-disable-next-line no-console
      console.log('create payment account success');
    }

    const { paymentAccounts } = await client.payment.getPaymentAccountsByOwner({
      owner: ACCOUNT_ADDRESS,
    });
    const paymentAccount = paymentAccounts[0];

    // deposit to payment account
    const depositTx = await client.payment.deposit({
      amount: parseEther('0.05').toString(),
      creator: ACCOUNT_ADDRESS,
      to: paymentAccount,
    });
    const depositSimulateInfo = await depositTx.simulate({
      denom: 'BNB',
    });
    const depositRes = await depositTx.broadcast({
      denom: 'BNB',
      gasLimit: Number(depositSimulateInfo?.gasLimit),
      gasPrice: depositSimulateInfo?.gasPrice || '5000000000',
      payer: ACCOUNT_ADDRESS,
      granter: '',
    });

    if (depositRes.code === 0) {
      // eslint-disable-next-line no-console
      console.log('payment account deposit success');
    }

    // set flow rate limit
    const setFlowRateLimitTx = await client.bucket.setPaymentAccountFlowRateLimit({
      operator: ACCOUNT_ADDRESS,
      bucketName: BUCKET_NAME,
      bucketOwner: ACCOUNT_ADDRESS,
      paymentAddress: paymentAccount,
      flowRateLimit: '1000',
    });
    const setFlowRateLimitSimulateInfo = await setFlowRateLimitTx.simulate({
      denom: 'BNB',
    });
    const setFlowRateLimitRes = await setFlowRateLimitTx.broadcast({
      denom: 'BNB',
      gasLimit: Number(setFlowRateLimitSimulateInfo?.gasLimit),
      gasPrice: setFlowRateLimitSimulateInfo?.gasPrice || '5000000000',
      payer: ACCOUNT_ADDRESS,
      granter: '',
    });
    if (setFlowRateLimitRes.code === 0) {
      // eslint-disable-next-line no-console
      console.log('payment account set flow rate limit success');
    }

    // upload object
    const file = createFile('./README.md');
    const res = await client.object.delegateUploadObject(
      {
        bucketName: BUCKET_NAME,
        objectName: 'b333',
        body: file,
        delegatedOpts: {
          visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
        },
      },
      {
        type: 'ECDSA',
        privateKey: ACCOUNT_PRIVATEKEY,
      },
    );
    if (res.code === 0) {
      // eslint-disable-next-line no-console
      console.log('upload object success');
    }

    // Revoke allowance
    // flow rate limit is 0
    const setPaymentAccountFlowRateLimitTx = await client.bucket.setPaymentAccountFlowRateLimit({
      operator: ACCOUNT_ADDRESS,
      bucketName: BUCKET_NAME,
      bucketOwner: ACCOUNT_ADDRESS,
      paymentAddress: paymentAccount,
      flowRateLimit: '0',
    });
    const setPaymentAccountFlowSimulateInfo = await setPaymentAccountFlowRateLimitTx.simulate({
      denom: 'BNB',
    });
    const setPaymentAccountFlowRes = await setPaymentAccountFlowRateLimitTx.broadcast({
      denom: 'BNB',
      gasLimit: Number(setPaymentAccountFlowSimulateInfo?.gasLimit),
      gasPrice: setPaymentAccountFlowSimulateInfo?.gasPrice || '5000000000',
      payer: ACCOUNT_ADDRESS,
      granter: '',
    });
    if (setPaymentAccountFlowRes.code === 0) {
      // eslint-disable-next-line no-console
      console.log('payment account set flow rate limit success');
    }

    // granter can grant again
    // flow rate limit is not 0
    const setPaymentAccountFlowRateLimiAgainTx = await client.bucket.setPaymentAccountFlowRateLimit(
      {
        operator: ACCOUNT_ADDRESS,
        bucketName: BUCKET_NAME,
        bucketOwner: ACCOUNT_ADDRESS,
        paymentAddress: paymentAccount,
        flowRateLimit: '10000',
      },
    );
    const setPaymentAccountFlowAgainSimulateInfo =
      await setPaymentAccountFlowRateLimiAgainTx.simulate({
        denom: 'BNB',
      });
    const setPaymentAccountFlowAgainRes = await setPaymentAccountFlowRateLimiAgainTx.broadcast({
      denom: 'BNB',
      gasLimit: Number(setPaymentAccountFlowAgainSimulateInfo?.gasLimit),
      gasPrice: setPaymentAccountFlowAgainSimulateInfo?.gasPrice || '5000000000',
      payer: ACCOUNT_ADDRESS,
      granter: '',
    });
    if (setPaymentAccountFlowAgainRes.code === 0) {
      // eslint-disable-next-line no-console
      console.log('payment account set flow rate limit success');
    }
  });
});
