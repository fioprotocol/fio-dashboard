'use strict';

module.exports = {
  up: async QI => {
    await QI.sequelize.query(`
      UPDATE "referrer-profiles"
      SET settings = settings::jsonb #- '{allowCustomDomain}'
    `);
  },
  down: async QI => {
    await QI.sequelize.query(`
      UPDATE "referrer-profiles"
      SET settings = jsonb_set(settings::jsonb, '{allowCustomDomain}', 'true', true)
    `);
  },
};
