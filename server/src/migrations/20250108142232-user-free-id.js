'use strict';

const USER_PROFILE_TYPE = {
  PRIMARY: 'PRIMARY',
  ALTERNATIVE: 'ALTERNATIVE',
  WITHOUT_REGISTRATION: 'WITHOUT_REGISTRATION',
};

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

      const setFreeId = async userType => {
        const limit = 20000;
        let finish = false;
        while (!finish) {
          const users = await QI.sequelize.query(
            `
          SELECT id, username, "userProfileType"
          FROM "users"
          WHERE "freeId" IS NULL AND "userProfileType" = '${userType}'
          ORDER BY "id" ASC
          LIMIT ${limit};
        `,
            { type: QI.sequelize.QueryTypes.SELECT, transaction: t },
          );

          if (users && users.length) {
            let usersToUpdate = [];
            if (userType === USER_PROFILE_TYPE.PRIMARY) {
              usersToUpdate = users.map(user => ({
                id: user.id,
                freeId: user.username || user.id,
              }));
            }

            if (userType === USER_PROFILE_TYPE.WITHOUT_REGISTRATION) {
              const wallets = await QI.sequelize.query(
                `
                  SELECT id, "publicKey", "from", "userId"
                  FROM "wallets"
                  WHERE "userId" IN(${users
                    .map(({ id }) => `'${id}'`)
                    .join(',')}) AND "from" = 'WITHOUT_REGISTRATION'
                `,
                { type: QI.sequelize.QueryTypes.SELECT, transaction: t },
              );
              usersToUpdate = wallets.map(({ userId, publicKey }) => ({
                id: userId,
                freeId: publicKey || userId,
              }));
              const walletsMap = wallets.reduce((acc, wallet) => {
                acc[wallet.userId] = wallet.publicKey;
                return acc;
              }, {});

              const noWalletUsers = users.filter(({ id }) => !walletsMap[id]);

              if (noWalletUsers.length) {
                // no wallets found for freeId value
                await QI.sequelize.query(
                  `
                    DELETE FROM "users"
                    WHERE "id" IN(${noWalletUsers.map(({ id }) => `'${id}'`).join(',')})
                  `,
                  { type: QI.sequelize.QueryTypes.DELETE, transaction: t },
                );
              }
            }

            if (userType === USER_PROFILE_TYPE.ALTERNATIVE) {
              const wallets = await QI.sequelize.query(
                `
                  SELECT id, "publicKey", "from", "userId"
                  FROM "wallets"
                  WHERE "userId" IN(${users.map(({ id }) => `'${id}'`).join(',')}) 
                    AND "from" = 'METAMASK' AND "data"->>'derivationIndex' = '0';
                `,
                { type: QI.sequelize.QueryTypes.SELECT, transaction: t },
              );
              const walletsMap = wallets.reduce((acc, wallet) => {
                acc[wallet.userId] = wallet.publicKey;
                return acc;
              }, {});

              usersToUpdate = users.map(({ id }) => ({
                id,
                freeId: walletsMap[id] || id,
              }));
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
                          .map(
                            userToUpdate => `${QI.sequelize.escape(userToUpdate.freeId)}`,
                          )
                          .join(',')}]) as free_id) as data_table
            WHERE id = data_table.u_id;
          `,
              { type: QI.sequelize.QueryTypes.UPDATE, transaction: t },
            );
          } else {
            finish = true;
          }
        }
      };

      await setFreeId(USER_PROFILE_TYPE.PRIMARY);
      await setFreeId(USER_PROFILE_TYPE.ALTERNATIVE);
      await setFreeId(USER_PROFILE_TYPE.WITHOUT_REGISTRATION);
    });
  },

  down: async QI => {
    await QI.removeColumn('users', 'freeId');
  },
};
