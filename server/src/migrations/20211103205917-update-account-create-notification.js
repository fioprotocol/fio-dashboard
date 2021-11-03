'use strict';

module.exports = {
  up: async QI => {
    await QI.sequelize.query(
      `UPDATE public.notifications SET message = 'You''re all set to start managing FIO Addresses and Domains.' WHERE message = 'You''re all set to start managing FIO Addresses, Domains, Requests as well as staying';`,
    );
    await QI.sequelize.query(
      `UPDATE public.notifications SET title = 'Account Created' WHERE title = 'Account Create';`,
    );
  },

  down: async QI => {
    await QI.sequelize.query(
      `UPDATE public.notifications SET message = 'You''re all set to start managing FIO Addresses, Domains, Requests as well as staying' WHERE message = 'You''re all set to start managing FIO Addresses and Domains.';`,
    );
    await QI.sequelize.query(
      `UPDATE public.notifications SET title = 'Account Create' WHERE title = 'Account Created';`,
    );
  },
};
