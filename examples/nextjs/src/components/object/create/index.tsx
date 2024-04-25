import { client } from '@/client';
import { getOffchainAuthKeys } from '@/utils/offchainAuth';
import {
  bytesFromBase64,
  Long,
  OnProgressEvent,
  RedundancyType,
  VisibilityType,
} from '@bnb-chain/greenfield-js-sdk';
import { ReedSolomon } from '@bnb-chain/reed-solomon';
import { ChangeEvent, useState } from 'react';
import { useAccount } from 'wagmi';
import { CreateObjectWithTx } from './withTx';
import { DelegrateObject } from './delegrate';

export const CreateObject = () => {
  return (
    <div>
      <CreateObjectWithTx />

      <br />

      <DelegrateObject />
    </div>
  );
};
