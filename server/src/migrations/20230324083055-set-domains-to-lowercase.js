'use strict';

module.exports = {
  up: async QI => {
    await QI.sequelize.query(`UPDATE public.domains SET name = LOWER(name)`);
  },

  down: async () => {
    //
  },
};
