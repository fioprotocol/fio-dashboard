'use strict';

module.exports = {
  up: async QI => {
    try {
      await QI.sequelize.query(
        `ALTER TYPE enum_users_status ADD VALUE 'NEW_EMAIL_NOT_VERIFIED';`,
      );
    } catch (e) {
      //
    }

    return;
  },

  down: async () => {
    //
  },
};
