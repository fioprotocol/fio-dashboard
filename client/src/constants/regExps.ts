export const EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

export const ADDRESS_REGEXP = /^[a-zA-Z\d]*[a-zA-Z\-\d]*[a-zA-Z\d]$/;

export const CHAIN_CODE_REGEXP = /^[A-Z0-9]+$/;
export const TOKEN_CODE_REGEXP = /^(([A-Z0-9]+)|^\$[A-Z0-9]+)(([A-Z0-9])+|\+{0,})$|^\*{1}$/;

export const URL_REGEXP = /\b(https?:\/\/\S*\b)/;

export const WALLET_NAME_REGEX = /^[a-zA-Z0-9\s\-_]{1,32}$/i;

export const INVALID_PASSWORD = /invalid password/gi;

export const IS_REFERRAL_PROFILE_PATH = /^\/ref\/[a-zA-Z0-9-_]+$/;

export const ENDS_WITH_FORWARD_SLASH_REGEX = '^.*/$';

export const DOMAIN_EXP_DEBUG_AFFIX = /testdomainexpiration/i;
export const DOMAIN_EXP_IN_30_DAYS = /expsoon30/i;

export const USERNAME_REGEX = /^[a-z0-9-]+$/;
