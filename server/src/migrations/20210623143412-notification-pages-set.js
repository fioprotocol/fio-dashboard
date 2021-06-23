'use strict';

module.exports = {
  up: async QI => {
    await QI.sequelize.query(
      `UPDATE public.notifications SET data = '{"pagesToShow": ["/"]}';`,
    );
  },

  down: async QI => {
    await QI.sequelize.query(
      `UPDATE public.notifications SET data = '{"pagesToShow": ["/dashboard"]}';`,
    );
  },
};
