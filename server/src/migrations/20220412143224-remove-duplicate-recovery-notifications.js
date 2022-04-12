'use strict';

module.exports = {
  async up(QI) {
    return QI.sequelize.query(
      `delete from public.notifications where "contentType" = 'RECOVERY_PASSWORD' and "closeDate" is null`,
    );
  },

  async down() {
    //
  },
};
