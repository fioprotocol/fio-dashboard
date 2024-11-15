'use strict';

module.exports = {
  up: async QI => {
    return QI.bulkInsert('vars', [
      {
        key: 'VOTE_FIO_HANDLE',
        value: 'vote@fio',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'MOCKED_PUBLIC_KEYS_FOR_BOARD_VOTE',
        value: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async QI => {
    return QI.bulkDelete('vars', {
      key: ['VOTE_FIO_HANDLE', 'MOCKED_PUBLIC_KEYS_FOR_BOARD_VOTE'],
    });
  },
};
