import {
  AuthExtension,
  BankExtension,
  createProtobufRpcClient,
  QueryClient,
  setupAuthExtension,
  setupAuthzExtension,
  setupBankExtension,
  setupDistributionExtension,
  setupFeegrantExtension,
  setupGovExtension,
  setupIbcExtension,
  setupMintExtension,
  setupSlashingExtension,
  setupStakingExtension,
  setupTxExtension,
  TxExtension,
} from '@cosmjs/stargate';
import { AuthzExtension } from '@cosmjs/stargate/build/modules/authz/queries';
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { BaseAccount } from '@bnb-chain/greenfield-cosmos-types/cosmos/auth/v1beta1/auth';
import { QueryTotalSupplyResponse } from '@bnb-chain/greenfield-cosmos-types/cosmos/bank/v1beta1/query';
import { Coin } from '@bnb-chain/greenfield-cosmos-types/cosmos/base/v1beta1/coin';
import { GetTxResponse } from '@bnb-chain/greenfield-cosmos-types/cosmos/tx/v1beta1/service';

type Denom = string;
type Address = string;

const makeClientWithExtension = async (
  rpcUrl: string,
): Promise<
  [QueryClient & BankExtension & TxExtension & AuthExtension & AuthzExtension, Tendermint34Client]
> => {
  const tmClient = await Tendermint34Client.connect(rpcUrl);
  return [
    QueryClient.withExtensions(
      tmClient,
      setupAuthExtension,
      setupAuthzExtension,
      setupBankExtension,
      setupDistributionExtension,
      setupFeegrantExtension,
      setupGovExtension,
      setupIbcExtension,
      setupMintExtension,
      setupSlashingExtension,
      setupStakingExtension,
      setupTxExtension,
    ),
    tmClient,
  ];
};

const makeRpcClient = async (rpcUrl: string) => {
  const [, tmClient] = await makeClientWithExtension(rpcUrl);
  const rpc = createProtobufRpcClient(new QueryClient(tmClient));
  return rpc;
};

const getBlock = async (rpcUrl: string) => {
  const [, tmClient] = await makeClientWithExtension(rpcUrl);
  return await tmClient.block();
};

/**
 * @accountAddr account address eg.'2F94D3BFB4480C93E433DCCEB73F8EF3145C9C041B23C0CEAD82F4548F7B8A11'
 *
 * @returns BaseAccount
 */
const getAccount = async (rpcUrl: string, accountAddr: Address): Promise<BaseAccount> => {
  const [client] = await makeClientWithExtension(rpcUrl);
  const account = await client.auth.account(accountAddr);
  if (!account) return BaseAccount.fromJSON({});

  return BaseAccount.toJSON(BaseAccount.decode(account.value)) as BaseAccount;
};

/**
 * @txHash hash of tx eg.'2F94D3BFB4480C93E433DCCEB73F8EF3145C9C041B23C0CEAD82F4548F7B8A11'
 */
const getTx = async (rpcUrl: string, txHash: string): Promise<GetTxResponse> => {
  const [client] = await makeClientWithExtension(rpcUrl);
  return await client.tx.getTx(txHash);
};

const getBalance = async (
  rpcUrl: string,
  { address, denom }: { address: Address; denom: Denom },
): Promise<Coin> => {
  const [client] = await makeClientWithExtension(rpcUrl);
  return await client.bank.balance(address, denom);
};

const getAllBalances = async (
  rpcUrl: string,
  { address }: { address: Address },
): Promise<Coin[]> => {
  const [client] = await makeClientWithExtension(rpcUrl);
  return await client.bank.allBalances(address);
};

const getTotalSupply = async (rpcUrl: string): Promise<QueryTotalSupplyResponse> => {
  const [client] = await makeClientWithExtension(rpcUrl);
  return await client.bank.totalSupply();
};

const getSupplyOf = async (rpcUrl: string, { denom }: { denom: Denom }): Promise<Coin> => {
  const [client] = await makeClientWithExtension(rpcUrl);
  return await client.bank.supplyOf(denom);
};

export {
  getBlock,
  getBalance,
  getAllBalances,
  getAccount,
  getTotalSupply,
  getSupplyOf,
  getTx,
  makeRpcClient,
};
export default makeClientWithExtension;
