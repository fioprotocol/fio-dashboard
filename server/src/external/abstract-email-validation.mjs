import superagent from 'superagent';

import logger from '../logger.mjs';

export const abstractEmailValidation = async ({ email }) => {
  const url = `https://emailvalidation.abstractapi.com/v1/`;

  const query = {
    api_key: process.env.ABSTRACT_EMAIL_VERIFICATION_API_KEY,
    email,
  };

  try {
    const res = await superagent
      .get(url)
      .set('Content-Type', 'application/json')
      .query(query);
    return res.body;
  } catch (error) {
    logger.error('Error on abstract email validation:', error);
  }
};
