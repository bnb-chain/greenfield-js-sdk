import { GroupPolicy } from './groupPolicy';
import { ObjectPolicy } from './objectPolicy';

export const Policy = () => {
  return (
    <>
      <h2>Policy</h2>
      <ObjectPolicy />

      <GroupPolicy />
    </>
  );
};
