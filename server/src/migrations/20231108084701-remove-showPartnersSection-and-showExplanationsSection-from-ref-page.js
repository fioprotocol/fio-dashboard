'use strict';

module.exports = {
  up: async QI => {
    await QI.sequelize.query(`
      UPDATE "referrer-profiles"
      SET settings = settings::jsonb #- '{showExplanationsSection}'
    `);
    await QI.sequelize.query(`
      UPDATE "referrer-profiles"
      SET settings = settings::jsonb #- '{showPartnersSection}'
    `);
  },
  down: async QI => {
    await QI.sequelize.query(`
      UPDATE "referrer-profiles"
      SET settings = jsonb_set(settings::jsonb, '{showExplanationsSection}', 'false', true)
      WHERE type = 'REFERRER'
    `);
    await QI.sequelize.query(`
      UPDATE "referrer-profiles"
      SET settings = jsonb_set(settings::jsonb, '{showPartnersSection}', 'false', true)
      WHERE type = 'REFERRER'
    `);
  },
};
