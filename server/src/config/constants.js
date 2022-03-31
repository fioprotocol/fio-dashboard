const WALLET_CREATED_FROM = {
  EDGE: 'EDGE',
  LEDGER: 'LEDGER',
};

const EXPIRING_DOMAINS_EMAIL_SUBJECTS = {
  ABOUT_TO_EXPIRE: 'Your FIO domain is about to expire',
  EXPIRED_30: 'Your FIO domain has expired',
  EXPIRED_90: 'Your FIO domain has expired and will be burned',
  EXPIRED: 'Your FIO domain and associated addresses have been burned',
};

module.exports = {
  WALLET_CREATED_FROM,
  EXPIRING_DOMAINS_EMAIL_SUBJECTS,
};
