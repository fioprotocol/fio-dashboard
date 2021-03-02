import PG from 'pg';
import config from '../src/config';

const { port, database, username, password } = config.postgres;

const client = new PG.Client({ port, user: username, password, database });

async function create() {
  try {
    await client.query('DROP DATABASE IF EXISTS test');
    await client.query('CREATE DATABASE test');
    process.exit(0);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    process.exit(1);
  }
}

client.connect().then(create);
