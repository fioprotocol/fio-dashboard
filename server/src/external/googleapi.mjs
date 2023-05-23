import superagent from 'superagent';

import logger from '../logger.mjs';

export const sendGTMEvent = async ({ event, clientId, data, sessionId }) => {
  const url = `https://www.google-analytics.com/mp/collect`;

  const body = {
    client_id: clientId,
    non_personalized_ads: false,
    events: [
      {
        name: event,
        params: {
          items: data.items,
          currency: data.currency,
          value: data.value,
          session_id: sessionId,
          payment_type: data.payment_type,
        },
      },
    ],
  };

  const query = {
    api_secret: process.env.GOOGLE_MEASUREMENT_PROTOCOL_API_KEY,
    measurement_id: process.env.GOOGLE_TAG_MANAGER_ID,
  };

  try {
    await superagent
      .post(url)
      .set('Content-Type', 'application/json')
      .query(query)
      .send(body);
  } catch (error) {
    logger.error('Error sending event:', error);
  }
};
