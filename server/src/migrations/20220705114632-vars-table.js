'use strict';

module.exports = {
  up: async (QI, DT) => {
    return QI.createTable('vars', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      key: { type: DT.STRING },
      value: { type: DT.TEXT },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
    });
  },

  down: async QI => {
    return QI.dropTable('vars');
  },
};
