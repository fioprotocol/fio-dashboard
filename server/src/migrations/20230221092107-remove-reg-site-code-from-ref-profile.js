'use strict';

module.exports = {
  up: async QI => {
    await QI.removeColumn('referrer-profiles', 'regRefCode');
  },

  down: async (QI, DT) => {
    await QI.addColumn('referrer-profiles', 'regRefCode', {
      type: DT.STRING,
      allowNull: true,
    });
    await QI.sequelize.query(
      `update public."referrer-profiles" set "regRefCode" = COALESCE("code") WHERE "type" = 'REFERRER'`,
    );
  },
};
