const WALLET_CREATED_FROM = {
  EDGE: 'EDGE',
  LEDGER: 'LEDGER',
};

const DOMAIN_EXP_PERIOD = {
  ABOUT_TO_EXPIRE: 'ABOUT_TO_EXPIRE',
  EXPIRED_30: 'EXPIRED_30',
  EXPIRED_90: 'EXPIRED_90',
  EXPIRED: 'EXPIRED',
};

const EXPIRING_DOMAINS_EMAIL_SUBJECTS = {
  [DOMAIN_EXP_PERIOD.ABOUT_TO_EXPIRE]: 'Your FIO domain(s) is about to expire',
  [DOMAIN_EXP_PERIOD.EXPIRED_30]: 'Your FIO domain(s) has expired',
  [DOMAIN_EXP_PERIOD.EXPIRED_90]: 'Your FIO domain(s) has expired and will be burned',
  [DOMAIN_EXP_PERIOD.EXPIRED]:
    'Your FIO domain(s) and associated addresses have been burned',
};

const EXPIRING_DOMAINS_EMAIL_TITLE = {
  [DOMAIN_EXP_PERIOD.ABOUT_TO_EXPIRE]: 'FIO Domain(s) Expiring',
  [DOMAIN_EXP_PERIOD.EXPIRED_30]: 'FIO Domain(s) has Expired',
  [DOMAIN_EXP_PERIOD.EXPIRED_90]: 'FIO Domain(s) will be burned',
  [DOMAIN_EXP_PERIOD.EXPIRED]: 'FIO Domain(s) has been burned',
};

module.exports = {
  WALLET_CREATED_FROM,
  DOMAIN_EXP_PERIOD,
  EXPIRING_DOMAINS_EMAIL_SUBJECTS,
  EXPIRING_DOMAINS_EMAIL_TITLE,
};
