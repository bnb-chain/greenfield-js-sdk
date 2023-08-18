import { singleton } from 'tsyringe';

type AuthType = 'AuthV1' | 'OffChainAuth';

@singleton()
export class SpClient {
  public callApi() {
    // 1. make headers (makeAuth)
    // 2. fetchWithTimeout
    // 3. parse XML response
    // 4. return response
  }

  private makeAuth(type: AuthType) {
    // TODO
    const auth = 'some operates';
    // if (type === 'AuthV1') {
    //   return auth
    // }

    if (type === 'OffChainAuth') {
      // 1. Add two headers
      // 2. offchain.sign
    }

    return auth;
  }
}
