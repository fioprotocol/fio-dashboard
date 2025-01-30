'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.sequelize.transaction(async t => {
      await QI.addColumn(
        'free-addresses',
        'freeId',
        {
          type: DT.STRING,
          allowNull: true,
          defaultValue: null,
        },
        {
          transaction: t,
        },
      );
      await QI.addIndex('free-addresses', {
        fields: ['freeId'],
        using: 'BTREE',
        transaction: t,
      });

      const limit = 20000;
      let finish = false;
      while (!finish) {
        const freeAddresses = await QI.sequelize.query(
          `
          SELECT f.id, f."userId", f."publicKey", u."freeId"
          FROM "free-addresses" f
          LEFT JOIN "users" u ON u.id = f."userId"
          WHERE f."freeId" IS NULL
          ORDER BY "id" ASC
          LIMIT ${limit};
        `,
          { type: QI.sequelize.QueryTypes.SELECT, transaction: t },
        );

        if (freeAddresses && freeAddresses.length) {
          await QI.sequelize.query(
            `
            UPDATE "free-addresses"
            SET "freeId" = data_table.free_id
            FROM
                (SELECT unnest(array[${freeAddresses
                  .map(freeAddress => `${freeAddress.id}`)
                  .join(',')}]) as fa_id, 
                        unnest(array[${freeAddresses
                          .map(
                            freeAddress =>
                              `${QI.sequelize.escape(
                                freeAddress.freeId || freeAddress.publicKey,
                              )}`,
                          )
                          .join(',')}]) as free_id) as data_table
            WHERE id = data_table.fa_id;
          `,
            { type: QI.sequelize.QueryTypes.UPDATE, transaction: t },
          );
        } else {
          finish = true;
        }
      }

      await QI.removeColumn('free-addresses', 'userId', { transaction: t });
      await QI.removeColumn('free-addresses', 'publicKey', { transaction: t });
    });
  },

  down: async (QI, DT) => {
    await QI.sequelize.transaction(async t => {
      await QI.addColumn(
        'free-addresses',
        'userId',
        {
          type: DT.UUID,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'cascade',
          onDelete: 'set null',
          allowNull: true,
        },
        { transaction: t },
      );
      await QI.addColumn(
        'free-addresses',
        'publicKey',
        {
          type: DT.STRING,
        },
        { transaction: t },
      );

      const limit = 5000;
      let finish = false;
      while (!finish) {
        const freeAddresses = await QI.sequelize.query(
          `
          SELECT f.id, f."publicKey", f."freeId", u."id" as uid, u."userProfileType"
          FROM "free-addresses" f
          LEFT JOIN "users" u ON u."freeId" = f."freeId"
          WHERE f."userId" IS NULL AND f."publicKey" IS NULL
          ORDER BY "id" ASC
          LIMIT ${limit};
        `,
          { type: QI.sequelize.QueryTypes.SELECT, transaction: t },
        );
        if (freeAddresses && freeAddresses.length) {
          const query = `
            UPDATE "free-addresses"
            SET "userId" = data_table.u_id, "publicKey" = data_table.pub_key
            FROM
                (SELECT unnest(array[${freeAddresses
                  .map(freeAddress => `${freeAddress.id}`)
                  .join(',')}]) as fa_id, 
                        unnest(array[${freeAddresses
                          .map(freeAddress =>
                            freeAddress.uid ? `uuid('${freeAddress.uid}')` : 'null',
                          )
                          .join(',')}]) as u_id,
                        unnest(array[${freeAddresses
                          .map(freeAddress =>
                            freeAddress.userProfileType !== 'PRIMARY'
                              ? `${QI.sequelize.escape(freeAddress.freeId)}`
                              : 'null',
                          )
                          .join(',')}]) as pub_key
                        ) as data_table
            WHERE id = data_table.fa_id;
          `;
          await QI.sequelize.query(query, {
            type: QI.sequelize.QueryTypes.UPDATE,
            transaction: t,
          });
        } else {
          finish = true;
        }
      }

      await QI.removeColumn('free-addresses', 'freeId', { transaction: t });
    });
  },
};
