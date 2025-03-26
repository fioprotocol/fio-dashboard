import crypto from 'crypto';

import jwt from 'jsonwebtoken';

import config from '../config';

// eslint-disable-next-line
export const generateApiToken = () => crypto.randomBytes(35).toString("base64").replace(/[\+\/=]/g, "")

export const checkApiToken = apiToken => /^[0-9a-zA-Z]{33,47}$/.test(apiToken);

export const createHash = data =>
  crypto
    .createHash('sha256')
    .update(data)
    .digest()
    .toString('hex');

/**
 * Generates a JWT device token with device information
 * @returns {Object} - Object containing the token and device ID
 */
export const generateDeviceToken = () => {
  // Generate a unique device ID
  const deviceId = crypto.randomBytes(16).toString('hex');

  // Create a JWT token with device information
  const token = jwt.sign(
    {
      deviceId,
    },
    config.deviceSecret,
  );

  return { token, deviceId };
};

/**
 * Verifies a device token
 * @param {string} token - The JWT token to verify
 * @returns {Object|null} - Decoded token payload if valid, null otherwise
 */
export const verifyDeviceToken = token => {
  try {
    const decoded = jwt.verify(token, config.deviceSecret);
    return decoded;
  } catch (error) {
    return null;
  }
};
