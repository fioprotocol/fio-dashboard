import superagent from 'superagent';

import logger from '../logger.mjs';

export const sendGTMEvent = async ({ event, clientId, data }) => {
  const url = `https://www.google-analytics.com/collect`;

  const payload = {
    v: '1', // Protocol Version
    tid: process.env.GOOGLE_TAG_MANAGER_ID, // Tracking ID / GTM container ID
    cid: clientId, // Client ID
    t: 'event', // Hit type: Event
    ea: event, // Event Action
    data,
  };

  try {
    await superagent.post(url).query(payload);
  } catch (error) {
    logger.error('Error sending event:', error);
  }
};
