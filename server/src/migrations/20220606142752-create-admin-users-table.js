'use strict';

const config = require('../config/constants');

module.exports = {
  up: (QI, DT) => {
    return QI.createTable('admin-users', {
      id: {
        type: DT.UUID,
        defaultValue: DT.UUIDV4,
        primaryKey: true,
      },
      email: { type: DT.STRING, unique: true },
      password: { type: DT.STRING },
      status: {
        type: DT.STRING,
        defaultValue: config.USER_STATUS.NEW,
      },
      role: {
        type: DT.STRING,
        defaultValue: config.USER_ROLES.ADMIN,
      },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
      deletedAt: { type: DT.DATE },
    });
  },

  down: QI => {
    return QI.dropTable('admin-users');
  },
};
