'use strict';

module.exports = {
  up: async QI => {
    return QI.sequelize.query(
      `update public.payments set "processor" = 'STRIPE' WHERE "processor" = 'CREDIT_CARD'`,
    );
  },

  down: async QI => {
    return QI.sequelize.query(
      `update public.payments set "processor" = 'CREDIT_CARD' WHERE "processor" = 'STRIPE'`,
    );
  },
};
