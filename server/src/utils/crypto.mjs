import crypto from 'crypto';

// eslint-disable-next-line
export const generateApiToken = () => crypto.randomBytes(35).toString("base64").replace(/[^\x00-\x7F]*/g,'');

export const hashFromApiToken = apiToken =>
  crypto
    .createHash('sha256')
    .update(apiToken)
    .digest()
    .toString('hex');

export const checkApiToken = apiToken => /^[0-9a-zA-Z]{33,47}$/.test(apiToken);
