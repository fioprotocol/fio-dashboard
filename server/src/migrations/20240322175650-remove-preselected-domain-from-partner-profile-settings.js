'use strict';

module.exports = {
  up: async QI => {
    await QI.sequelize.query(`
      UPDATE "referrer-profiles"
      SET settings = settings::jsonb #- '{preselectedDomain}'
      WHERE type = 'REFERRER'
    `);
  },
  down: async QI => {
    await QI.sequelize.query(`
      UPDATE "referrer-profiles"
      SET settings = jsonb_set(
          settings::jsonb, 
          '{preselectedDomain}', 
          (
              SELECT 
                  to_jsonb(COALESCE((settings->'domains'->0->>'name')::text, ''))
              FROM "referrer-profiles"
              WHERE type = 'REFERRER'
              LIMIT 1
          ),
          true
      )
      WHERE type = 'REFERRER'
    `);
  },
};
