'use strict';

module.exports = {
  up: async QI => {
    return QI.bulkInsert('vars', [
      {
        key: 'IS_OUTBOUND_EMAIL_STOP',
        value: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async QI => {
    return QI.bulkDelete('vars', { key: 'IS_OUTBOUND_EMAIL_STOP' });
  },
};
