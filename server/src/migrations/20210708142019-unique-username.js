'use strict';

module.exports = {
  up: async QI => {
    return QI.addIndex('users', ['username'], {
      unique: true,
      fields: ['username'],
    });
  },

  down: async QI => {
    return QI.removeIndex('users', ['username']);
  },
};
