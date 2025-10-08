'use strict';

const path = require('path');

const { VARS_KEYS } = require(path.resolve(__dirname, '../config/constants.js'));

module.exports = {
  up: async QI => {
    const key = VARS_KEYS.FIO_LAST_NORM_EXP_SEC;
    // Create the key if it does not exist. Initialize to current epoch seconds.
    await QI.sequelize.query(
      `
      INSERT INTO vars("key", value, "createdAt", "updatedAt")
      SELECT :key, (EXTRACT(EPOCH FROM NOW())::bigint)::text, NOW(), NOW()
      WHERE NOT EXISTS (
        SELECT 1 FROM vars WHERE "key" = :key
      );
      `,
      { replacements: { key } },
    );
  },

  down: async QI => {
    const key = VARS_KEYS.FIO_LAST_NORM_EXP_SEC;
    await QI.sequelize.query(`DELETE FROM vars WHERE "key" = :key;`, {
      replacements: { key },
    });
  },
};
