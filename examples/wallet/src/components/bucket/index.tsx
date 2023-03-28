import { CreateBucket } from './create';
import { DeleteBucket } from './delete';
import { BucketInfo } from './info';

export const Bucket = () => {
  return (
    <div>
      <h2>Bucket</h2>

      <CreateBucket />

      <div style={{ marginTop: 10 }} />

      <DeleteBucket />

      <div style={{ marginTop: 10 }} />

      <BucketInfo />
    </div>
  );
};
