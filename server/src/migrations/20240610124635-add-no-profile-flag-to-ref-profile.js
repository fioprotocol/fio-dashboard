'use strict';

module.exports = {
  up: async QI => {
    await QI.sequelize.query(`
      UPDATE "referrer-profiles"
      SET settings = jsonb_set(settings::jsonb, '{hasNoProfileFlow}', 'false', true)
      WHERE type = 'REFERRER'
    `);
  },
  down: async QI => {
    await QI.sequelize.query(`
      UPDATE "referrer-profiles"
      SET settings = settings::jsonb #- '{hasNoProfileFlow}'
      WHERE type = 'REFERRER'
    `);
  },
};
