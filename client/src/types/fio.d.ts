export type NFT_ITEM = {
  chain_code: string;
  contract_address: string;
  token_id: string;
  url?: string;
  hash?: string;
  metadata?: string;
};

export type ActionDataParams = {
  actor?: string;
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
  producers?: string[];
  public_addresses?: {
    chain_code: string;
    token_code: string;
    public_address: string;
  }[];
  public_address?: string;
  to?: string;
  tpid?: string;
  quantity?: string;
};

export type DecryptedContent = Pick<ActionDataParams, 'content'>;
export type DecryptedItem = {
  contentType: string;
  decryptedData: DecryptedContent;
};

export type ActionParams = {
  account: string;
  action: string;
  contentType?: string;
  derivationIndex: number;
  data: ActionDataParams;
  payerFioPublicKey?: string;
  payeeFioPublicKey?: string;
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
    block_num: number;
  };
  transaction_id: string;
};

export type FioHistoryV2NodeAction = {
  '@timestamp': string; //"2024-12-13T12:03:57.500"
  timestamp: string; //"2024-12-13T12:03:57.500"
  block_num: number;
  trx_id: string;
  act: {
    account: string;
    name: string;
    authorization: {
      actor: string;
      permission: string;
    }[];
    data: ActionDataParams;
  };
  receipts: {
    receiver: string;
    global_sequence: number;
    recv_sequence: number;
    auth_sequence: [
      {
        account: string;
        sequence: number;
      },
    ];
  }[];
  global_sequence: number;
  producer: string;
  action_ordinal: number;
  creator_action_ordinal: number;
};

export type FioHistoryV2NodeActionResponse = {
  query_time_ms: number;
  cached: boolean;
  lib: number;
  last_indexed_block: number;
  last_indexed_block_time: string;
  total: {
    value: number;
    relation: string;
  };
  actions: FioHistoryV2NodeAction[];
};
