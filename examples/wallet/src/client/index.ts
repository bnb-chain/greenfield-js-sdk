import { GREEN_CHAIN_ID, GRPC_URL } from '@/config';
import { Client } from '@bnb-chain/greenfield-chain-sdk';

export const client = Client.create(GRPC_URL, String(GREEN_CHAIN_ID));
