'use strict';

module.exports = {
  up: async QI => {
    await QI.sequelize.query(`UPDATE public.users SET email = 'deprecated_' || email`);
    await QI.sequelize.query(`DELETE FROM public.notifications`);
    await QI.sequelize.query(`DELETE FROM public.actions`);
    return QI.sequelize.query(`DELETE FROM public.nonces`);
  },

  down: async () => {
    //
  },
};
