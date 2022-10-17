'use strict';

module.exports = {
  up: async QI => {
    await QI.sequelize.query(
      `update public."chain-codes-list" set "chainCodeName" = 'Binance Chain' WHERE "chainCodeName" = 'Binance Coin'`,
    );
    await QI.sequelize.query(
      `update public."chain-codes-list" set "chainCodeName" = 'Binance Smart Chain' WHERE "chainCodeName" = 'BSC FARM'`,
    );
    return;
  },

  down: async QI => {
    await QI.sequelize.query(
      `update public."chain-codes-list" set "chainCodeName" = 'Binance Coin' WHERE "chainCodeName" = 'Binance Chain'`,
    );
    await QI.sequelize.query(
      `update public."chain-codes-list" set "chainCodeName" = 'BSC FARM' WHERE "chainCodeName" = 'Binance Smart Chain'`,
    );
    return;
  },
};
