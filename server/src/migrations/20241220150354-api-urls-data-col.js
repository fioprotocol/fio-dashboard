'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('fio-api-urls', 'location', {
      type: DT.STRING,
      defaultValue: '',
    });
    await QI.addColumn('fio-api-urls', 'data', {
      type: DT.JSON,
      defaultValue: {},
    });
  },

  down: async QI => {
    await QI.removeColumn('fio-api-urls', 'location');
    await QI.removeColumn('fio-api-urls', 'data');
  },
};
