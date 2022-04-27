import dotenv from 'dotenv-safe';

import dbConfig from './dbConfig';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

dotenv.load({ allowEmptyValues: isDev });

export default {
  port: process.env.API_PORT,
  ws: process.env.WS_PORT,
  secret: process.env.HASH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
    options: {
      algorithm: 'HS256',
    },
  },
  mainUrl: process.env.BASE_URL,
  supportLink: process.env.FIOPROTOCOL_SUPPORT_LINK,
  mail: {
    mailchimpKey: process.env.MAILCHIMP_KEY,
    from: process.env.MAILCHIMP_FROM,
    fromName: process.env.MAILCHIMP_FROM_NAME,
    mailchimpMarketing: process.env.MAILCHIMP_MARKETING_KEY,
    mailchimpListId: process.env.MAILCHIMP_LIST_ID,
    mailchimpServerPrefix: process.env.MAILCHIMP_SERVER_PREFIX,
  },
  ...dbConfig,
};
