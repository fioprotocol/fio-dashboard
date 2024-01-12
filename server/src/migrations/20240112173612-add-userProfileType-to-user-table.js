'use strict';

const { USER_PROFILE_TYPE } = require('../config/constants');

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('users', 'userProfileType', {
      type: DT.ENUM,
      defaultValue: USER_PROFILE_TYPE.PRIMARY,
      values: Object.values(USER_PROFILE_TYPE),
    });
  },

  down: async QI => {
    await QI.removeColumn('users', 'userProfileType');
    await QI.sequelize.query('DROP TYPE IF EXISTS "enum_users_userProfileType";');
  },
};
