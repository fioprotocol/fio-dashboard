import db from '../src/db';

import { User } from '../../models';

let idReady = false;

export default class TestFactory {
  constructor() {
    // Additonal protection against running test on production db
    if (!db.config.database.match(/test$/i)) {
      throw new Error(
        `DATABASE [${db.config.database}] DOES NOT HAVE "test" IN ITS NAME`,
      );
    }
  }

  waitForReady() {
    return new Promise(res => {
      if (idReady) return res();
      db.afterBulkSync(() => {
        idReady = true;
        res();
      });
    });
  }

  async createUser(data) {
    const user = new User(data);
    return user.save();
  }

  async setDefaultUsers() {
    const users = [
      {
        email: 'user1@gmail.com',
        password: 'password1',
        status: User.ACTIVE,
      },
      {
        email: 'user2@gmail.com',
        password: 'password2',
        status: User.BLOCKED,
      },
    ];

    return Promise.all(users.map(this.createUser));
  }

  cleanup() {
    return db.sync({ force: true });
  }
}
