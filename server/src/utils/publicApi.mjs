export const generateResponse = ({ error, errorCode, accountId, charge }) => {
  if (error !== undefined) {
    return { error, errorCode, success: false }
  }
  if (!accountId) {
    throw new Error('accountId is required');
  }
  if (!charge) {
    return { error:false, account_id: accountId, success: true }
  }

  const { eventId, externId, externStatus, externTime, metadata, pricing, addresses } = charge;

  return {
    error: false,
    account_id: accountId,
    success: {
      event_id: eventId || 0,
      pending: true,
      extern_id: externId,
      extern_status: externStatus,
      extern_time: (externTime || new Date()).toISOString(),
      metadata: metadata || null,
      pay_source: 'bitpay',
      forward_url: '',
      pricing, // Record<string, {amount: number;currency:string}>;
      addresses, // Record<string, string>;
    }
  }
}

export const formatChainDomain = (domain) => {
  if (!domain) {
    return;
  }
  const {id, name, domainhash, account, is_public, expiration} = domain
  return {
    id,
    name,
    domainHash: domainhash,
    account,
    isPublic: is_public === 1,
    expiration
  };
}

export const generateSummaryResponse = (data) => {
  // TODO update when data type is available
  return data.map(() => ({
    address: null,
    domain: 'fio',
    owner_key: 'FIO5fnvQGmLRv5JLytqgvfWZfPyi4ousY46zdRU9MSSzJksFDZSYu',
    trx_type: 'register',
    trx_id: '1fb666a590d8d6a0334b0ad7147c8eb65a83de8932dbc75bbcf158c0ecfaaa23',
    expiration: '2020-02-22T17:27:33.500Z',
    block_num: 1531052,
    trx_status: 'success',
    trx_status_notes: 'irreversible',
    pay_source: 'free',
    forward_url: null,
    buy_price: '0.03',
    pay_metadata: null,
    extern_id: null,
    pay_status: 'success',
    pay_status_notes: null,
    extern_time: null,
    extern_status: null
  }));
}
