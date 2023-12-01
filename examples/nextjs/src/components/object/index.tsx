import { CreateObject } from './create';
import { DeleteObject } from './del';
import { ObjectInfo } from './info';
import { getChecksumApiWorker } from '@bnb-chain/greenfiled-file-handle';

export const ObjectComponent = () => {
  console.log('getChecksumApi', getChecksumApiWorker, getChecksumApiWorker());

  return (
    <>
      <h2>Object</h2>
      <CreateObject />

      {/* <div style={{ marginTop: 10 }} />

      <CancelCreateObject /> */}

      <div style={{ marginTop: 10 }} />

      <DeleteObject />

      <div style={{ marginTop: 10 }} />

      <ObjectInfo />
    </>
  );
};
