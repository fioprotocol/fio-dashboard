import fetch from 'node-fetch';

import logger from '../logger.mjs';

const LEMIN_API_BASE_URL = 'https://api.leminnow.com/';
const LEMIN_CROPPED_CAPTCHA_PREFIX = 'captcha/v1/cropped';

export const registerCaptcha = async () => {
  try {
    // Lemin captcha initialization doesn't require server-side register call
    // We just return the success response with captchaId from environment
    return {
      success: true,
      captchaId: process.env.LEMIN_CAPTCHA_ID,
    };
  } catch (error) {
    logger.error('Error initializing Lemin captcha:', error);
    throw error;
  }
};

export const validate = async params => {
  const { challenge_id, answer } = params;
  if (!challenge_id || !answer) return false;

  try {
    // Call Lemin validation API
    const response = await fetch(
      `${LEMIN_API_BASE_URL}${LEMIN_CROPPED_CAPTCHA_PREFIX}/validate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          private_key: process.env.LEMIN_PRIVATE_KEY,
          challenge_id,
          answer,
        }),
      },
    );

    const result = await response.json();
    if (!result.success) {
      logger.error('Captcha validation failed', result);
    }
    // Lemin returns { success: true } when validation is successful
    return result.success === true;
  } catch (error) {
    logger.error('Error validating Lemin captcha:', error);
    return false;
  }
};
