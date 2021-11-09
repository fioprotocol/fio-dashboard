'use strict';

module.exports = {
  up: async (QI, DT) => {
    await QI.addColumn('notifications', 'contentType', {
      type: DT.STRING,
    });

    await QI.sequelize.query(
      `update public.notifications set "contentType" = 'RECOVERY_PASSWORD' where title = 'Password Recovery'`,
    );
    await QI.sequelize.query(
      `update public.notifications set "contentType" = 'ACCOUNT_CONFIRMATION' where title = 'Account Confirmation'`,
    );
    await QI.sequelize.query(
      `update public.notifications set "contentType" = 'ACCOUNT_CREATE' where title = 'Account Create'`,
    );
    await QI.sequelize.query(
      `update public.notifications set "title" = NULL, "message" = NULL`,
    );
  },

  down: async QI => {
    await QI.sequelize.query(
      `update public.notifications set "title" = 'Password Recovery', message = 'You have skipped setting up password recovery, Please make sure to complete this so you do not loose access' where "contentType" = 'RECOVERY_PASSWORD'`,
    );
    await QI.sequelize.query(
      `update public.notifications set "title" = 'Account Confirmation', message = 'Your email is confirmed' where "contentType" = 'ACCOUNT_CONFIRMATION'`,
    );
    await QI.sequelize.query(
      `update public.notifications set "title" = 'Account Create', message = 'You''re all set to start managing FIO Addresses and Domains.' where "contentType" = 'ACCOUNT_CREATE'`,
    );
    await QI.removeColumn('notifications', 'contentType');
  },
};
