'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (QI, DT) => {
    return await QI.addColumn('blockchain-transactions', 'baseUrl', {
      type: DT.STRING,
      allowNull: true,
    });
  },

  down: async QI => {
    return QI.removeColumn('blockchain-transactions', 'baseUrl');
  },
};
