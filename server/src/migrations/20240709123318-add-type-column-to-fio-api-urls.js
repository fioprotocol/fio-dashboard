'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('fio-api-urls', 'type', {
      type: DT.STRING,
      defaultValue: 'DASHBOARD_API',
    });
  },

  down: async QI => {
    await QI.removeColumn('fio-api-urls', 'type');
  },
};
