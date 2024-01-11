'use strict';

const uuid = require('uuid');

module.exports = {
  up: async QI => {
    try {
      await QI.sequelize.query(`ALTER TYPE enum_users_status ADD VALUE 'DELETED';`);
    } catch (e) {
      //
    }

    await QI.bulkInsert('users', [
      {
        id: uuid.v4(),
        email: 'DELETEDUSER',
        username: 'DELETEDUSER',
        status: 'DELETED',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    return;
  },

  down: async QI => {
    await QI.sequelize.query(`DELETE FROM users WHERE username='DELETEDUSER'`);
    return;
  },
};
