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
  mail: {
    adminEmail: 'admin@ezetech.com',
    transport: 'SMTP',
    smtp: 'smtps://ezetechmail@gmail.com:asdqwezxc01@smtp.gmail.com',
    from: '',
    transport_options: {
      service: 'Gmail',
      auth: {
        user: '',
        pass: '',
      },
    },
  },
  ...dbConfig,
};
