import dotenv from 'dotenv-safe';

import dbConfig from './dbConfig';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

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
  isProduction,
  mainUrl: process.env.BASE_URL,
  adminUrl: process.env.ADMIN_BASE_URL,
  supportLink: process.env.FIOPROTOCOL_SUPPORT_LINK,
  mail: {
    from: process.env.MAILER_FROM,
    transport: process.env.MAILER_TRANSPORT,
    smtp: process.env.MAILER_SMTP_ADDRESS,
    transport_options: {
      host: process.env.MAILER_SMTP_ADDRESS,
      port: process.env.MAILER_PORT,
      secure: true,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
    },
    sendinblueKey: process.env.MAILER_SENDINBLUE_KEY,
    sendinblueApiKey: process.env.SENDINBLUE_API_KEY,
    sendinbuleListId: process.env.SENDINBLUE_MARKETING_LIST,
    sendinblueEventUrl: process.env.SENDINBLUE_EVENT_URL,
    sendinblueEventTrackerId: process.env.SENDINBLUE_EVENT_TRACKER_ID,
  },
  infura: {
    apiKey: process.env.INFURA_API_KEY,
    apiSecret: process.env.INFURA_API_SECRET,
    defaultChainId: process.env.INFURA_NFT_DEFAULT_CHAIN_ID,
    nftBaseUrl: process.env.INFURA_NFT_BASE_URL,
  },
  nfts: {
    apiKey: process.env.NFT_PROVIDER_API_KEY,
    defaultChainName: process.env.NFT_DEFAULT_CHAIN_NAME,
  },
  ...dbConfig,
};
