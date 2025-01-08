'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.sequelize.transaction(async t => {
      await QI.addColumn(
        'users',
        'freeId',
        {
          type: DT.STRING,
          allowNull: true,
          defaultValue: null,
          unique: true,
        },
        {
          transaction: t,
        },
      );

      const limit = 500;
      let finish = false;
      while (!finish) {
        const users = await QI.sequelize.query(
          `
          SELECT id, username, "userProfileType"
          FROM "users"
          WHERE "freeId" IS NULL
          ORDER BY "id" ASC
          LIMIT ${limit};
        `,
          { type: QI.sequelize.QueryTypes.SELECT, transaction: t },
        );
        if (users && users.length) {
          const usersToUpdate = [];
          for (const user of users) {
            let freeId = user.username || user.id;
            if (user.userProfileType !== 'PRIMARY') {
              try {
                const wallets = await QI.sequelize.query(
                  `
              SELECT id, "publicKey", "from"
              FROM "wallets"
              WHERE "userId" = '${user.id}' AND (("from" = 'METAMASK' AND "data"->>'derivationIndex' = '0') OR "from" = 'WITHOUT_REGISTRATION')
              ORDER BY "createdAt" ASC
              LIMIT 1;
            `,
                  { type: QI.sequelize.QueryTypes.SELECT, transaction: t },
                );
                freeId = wallets[0].publicKey;
                usersToUpdate.push({ id: user.id, freeId });
              } catch (err) {
                // no wallets found for freeId value

                if (user.userProfileType === 'WITHOUT_REGISTRATION') {
                  await QI.sequelize.query(
                    `
                    DELETE FROM "users"
                    WHERE "userId" = '${user.id}';
                  `,
                    { type: QI.sequelize.QueryTypes.DELETE, transaction: t },
                  );
                }
              }
            } else {
              usersToUpdate.push({ id: user.id, freeId });
            }
          }
          await QI.sequelize.query(
            `
            UPDATE "users"
            SET "freeId" = data_table.free_id
            FROM
                (SELECT unnest(array[${usersToUpdate
                  .map(userToUpdate => `uuid('${userToUpdate.id}')`)
                  .join(',')}]) as u_id, 
                        unnest(array[${usersToUpdate
                          .map(userToUpdate => `'${userToUpdate.freeId}'`)
                          .join(',')}]) as free_id) as data_table
            WHERE id = data_table.u_id;
          `,
            { type: QI.sequelize.QueryTypes.UPDATE, transaction: t },
          );
        } else {
          finish = true;
        }
      }
    });
  },

  down: async QI => {
    await QI.removeColumn('users', 'freeId');
  },
};
