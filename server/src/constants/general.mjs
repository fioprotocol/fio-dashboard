import { DAY_MS } from '../config/constants.js';

export const NFT_LABEL = 'NFT';
export const TOKEN_LABEL = 'TOKEN';

export const HTTP_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  TOO_MANY_REQUESTS: 429,
};

export const ACTION_EPX_TIME = DAY_MS * 30;

export const DEFAULT_LIMIT = 25;
export const MAX_LIMIT = 50;
export const DEFAULT_OFFSET = 0;
export const REGSITE_NOTIF_EMAIL_KEY = 'REGSITE_NOTIF_EMAIL';
