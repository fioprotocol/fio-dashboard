'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.sequelize.transaction(async t => {
      await QI.createTable(
        'referrer-profile-api-tokens',
        {
          id: { type: DT.BIGINT, primaryKey: true, autoIncrement: true },
          token: { type: DT.STRING, allowNull: true },
          access: { type: DT.BOOLEAN, defaultValue: false },
          legacyHash: { type: DT.STRING, allowNull: true },
          dailyFreeLimit: { type: DT.INTEGER, allowNull: true },
          dailyFreeUsage: { type: DT.INTEGER, allowNull: true },
          dailyFreeDate: { type: DT.DATE, allowNull: true },
          refProfileId: {
            type: DT.BIGINT,
            references: {
              model: 'referrer-profiles',
              key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'set null',
            allowNull: true,
          },

          createdAt: { type: DT.DATE },
          updatedAt: { type: DT.DATE },
        },
        {
          transaction: t,
        },
      );

      const refProfiles = await QI.sequelize.query(
        `
        SELECT *
        FROM "referrer-profiles"
        WHERE type = 'REFERRER';
      `,
        { type: QI.sequelize.QueryTypes.SELECT, transaction: t },
      );

      const apiTokens = [];
      for (const refProfile of refProfiles) {
        const { id, apiToken, apiHash, apiAccess } = refProfile;

        apiTokens.push({
          refProfileId: id,
          token: apiToken,
          access: apiAccess,
          legacyHash: apiHash,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await QI.bulkInsert('referrer-profile-api-tokens', apiTokens, {
        transaction: t,
      });

      await QI.removeColumn('referrer-profiles', 'apiToken', { transaction: t });
      await QI.removeColumn('referrer-profiles', 'apiHash', { transaction: t });
      await QI.removeColumn('referrer-profiles', 'apiAccess', { transaction: t });
    });
  },

  down: async (QI, DT) => {
    await QI.sequelize.transaction(async t => {
      await QI.addColumn(
        'referrer-profiles',
        'apiToken',
        {
          type: DT.STRING,
          allowNull: true,
        },
        { transaction: t },
      );
      await QI.addColumn(
        'referrer-profiles',
        'apiHash',
        {
          type: DT.STRING,
          allowNull: true,
        },
        { transaction: t },
      );

      await QI.addColumn(
        'referrer-profiles',
        'apiAccess',
        {
          type: DT.BOOLEAN,
          defaultValue: false,
        },
        { transaction: t },
      );

      const refProfileApiTokens = await QI.sequelize.query(
        `
        SELECT *
        FROM "referrer-profile-api-tokens";
      `,
        { type: QI.sequelize.QueryTypes.SELECT, transaction: t },
      );

      for (const refProfileApiToken of refProfileApiTokens) {
        const { refProfileId, token, legacyHash, access } = refProfileApiToken;

        await QI.sequelize.query(
          `UPDATE "referrer-profiles"
            SET "apiToken" = '${token}', "apiHash" = '${legacyHash}', "apiAccess" = '${access}'
            WHERE type = 'REFERRER' AND id = ${refProfileId}`,
          { transaction: t },
        );
      }

      await QI.dropTable('referrer-profile-api-tokens', {
        transaction: t,
      });
    });
  },
};
