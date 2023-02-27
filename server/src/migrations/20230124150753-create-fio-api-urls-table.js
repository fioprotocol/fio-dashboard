'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.createTable('fio-api-urls', {
      id: {
        type: DT.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      url: {
        type: DT.STRING,
        allowNull: false,
      },
      createdAt: { type: DT.DATE },
      updatedAt: { type: DT.DATE },
      deletedAt: { type: DT.DATE },
    });

    return QI.sequelize.query(
      `INSERT INTO "fio-api-urls" (id, url, "createdAt", "updatedAt" ) VALUES (1, 'https://testnet.fioprotocol.io/v1/', NOW(), NOW())`,
    );
  },

  down: QI => {
    return QI.dropTable('fio-api-urls');
  },
};
