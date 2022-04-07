'use strict';

module.exports = {
  up: async (QI, DT) => {
    return QI.createTable('public-wallet-data', {
      id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
      walletId: {
        type: DT.BIGINT,
        references: {
          model: 'wallets',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'set null',
        allowNull: true,
        unique: true,
      },
      balance: { type: DT.STRING },
      requests: { type: DT.JSON },
      obtData: { type: DT.JSON },
      cryptoHandles: { type: DT.JSON },
      domains: { type: DT.JSON },
      meta: { type: DT.JSON },
    });
  },

  down: async QI => {
    return QI.dropTable('public-wallet-data');
  },
};
