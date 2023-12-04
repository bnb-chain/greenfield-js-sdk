import dotenv from 'dotenv';
dotenv.config({
  path: process.cwd() + '/tests/.env',
});

export const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS || '';
export const ACCOUNT_PRIVATEKEY = process.env.ACCOUNT_PRIVATEKEY || '';
export const GREENFIELD_URL =
  process.env.GREENFIELD_URL || 'https://gnfd-testnet-fullnode-tendermint-ap.bnbchain.org';
export const GREENFIELD_CHAIN_ID = process.env.GREENFIELD_CHAIN_ID || '5600';
