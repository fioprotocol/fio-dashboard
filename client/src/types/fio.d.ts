export type NFT_ITEM = {
  chain_code: string;
  contract_address: string;
  token_id: string;
  url?: string;
  hash?: string;
  metadata?: string;
};

export type ActionDataParams = {
  amount?: string | number;
  bundle_sets?: number;
  chain_code?: string;
  content?: {
    payer_public_address?: string;
    payee_public_address: string;
    amount: string | number;
    chain_code: string;
    token_code: string;
    status?: string;
    obt_id?: string;
    memo: string | null;
    hash?: string | null;
    offline_url?: string | null;
  };
  fio_address?: string;
  fio_domain?: string;
  fio_request_id?: string | number;
  is_public?: number;
  max_fee: number;
  max_oracle_fee?: number;
  nfts?: NFT_ITEM[];
  new_owner_fio_public_key?: string;
  owner_fio_public_key?: string;
  payer_fio_address?: string;
  payee_fio_address?: string;
  payee_public_key?: string;
  public_addresses?: {
    chain_code: string;
    token_code: string;
    public_address: string;
  }[];
  public_address?: string;
  tpid: string;
};

export type ActionParams = {
  account: string;
  action: string;
  contentType?: string;
  derivationIndex: number;
  data: ActionDataParams;
  payerFioPublicKey?: string;
};

export type DecryptActionParams = {
  content: string;
  contentType: string;
  derivationIndex: number;
  encryptionPublicKey: string;
};

export type FioServerResponse = {
  processed: {
    action_traces: Array<{
      act: {
        data: ActionDataParams;
      };
      block_time: string;
      receipt: {
        response: string;
      };
    }>;
  };
  transaction_id: string;
};
