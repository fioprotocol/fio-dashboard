'use strict';

module.exports = {
  up: async QI => {
    await QI.sequelize.query(`UPDATE public.users SET username = LOWER(username)`);
  },

  down: async () => {
    //
  },
};
