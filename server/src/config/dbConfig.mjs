import dotenv from 'dotenv-safe';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

dotenv.load({ allowEmptyValues: isDev });

export default {
  postgres: {
    database: process.env.TEST_MODE ? 'test' : process.env.SQL_DB,
    username: process.env.SQL_USER,
    password: process.env.SQL_PASS || '',
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: parseInt(process.env.SQL_MAX_POOL) || 50,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
