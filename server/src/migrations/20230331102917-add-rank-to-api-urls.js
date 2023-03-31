'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('fio-api-urls', 'rank', {
      type: DT.BIGINT,
    });

    await QI.sequelize.query(`
      update public."fio-api-urls" as fau
      set rank = sub.rn
      from (select id, row_number() over (order by id) as rn from public."fio-api-urls") sub
      where fau.id = sub.id;
    `);
  },

  down: async QI => {
    await QI.removeColumn('fio-api-urls', 'rank');
  },
};
