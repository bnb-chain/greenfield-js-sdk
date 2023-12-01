import { CreateObject } from './create';
import { DeleteObject } from './del';
import { ObjectInfo } from './info';

export const ObjectComponent = () => {
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
