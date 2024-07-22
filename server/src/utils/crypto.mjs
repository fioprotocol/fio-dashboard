import crypto from 'crypto';

// eslint-disable-next-line
export const generateApiToken = () => crypto.randomBytes(35).toString("base64").replace(/[\+\/=]/g, "")

export const checkApiToken = apiToken => /^[0-9a-zA-Z]{33,47}$/.test(apiToken);

export const createHash = data =>
  crypto
    .createHash('sha256')
    .update(data)
    .digest()
    .toString('hex');
