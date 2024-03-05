'use strict';

const { USER_PROFILE_TYPE } = require('../config/constants');

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('users', 'userProfileType', {
      type: DT.STRING,
      allowNull: false,
      defaultValue: USER_PROFILE_TYPE.PRIMARY,
    });
  },

  down: async QI => {
    await QI.removeColumn('users', 'userProfileType');
  },
};
