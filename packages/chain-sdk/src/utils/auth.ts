import { MOCK_SIGNATURE } from './http';

export const getAuthorizationAuthTypeV2 = () => {
  const signature = MOCK_SIGNATURE;
  const authorization = `authTypeV2 ECDSA-secp256k1, Signature=${signature}`;

  return authorization;
};
