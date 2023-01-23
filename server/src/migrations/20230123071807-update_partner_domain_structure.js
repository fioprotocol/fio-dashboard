'use strict';

module.exports = {
  up: async QI => {
    await QI.sequelize.query(
      `WITH domains AS (
        SELECT id, domain::jsonb
        FROM "referrer-profiles", json_array_elements(settings -> 'domains') WITH ordinality arr(domain)
        WHERE domain->>'name' IS NULL
      ),
      groupped_domains AS (
        SELECT id, jsonb_agg(jsonb_build_object('name', domain, 'isPremium', false, 'rank', 0)) AS updated_domains
        FROM domains
        GROUP BY id
      )
      UPDATE public."referrer-profiles" AS ref
      SET settings = jsonb_set(settings::jsonb, '{domains}', gd.updated_domains)::json
      FROM groupped_domains AS gd
      WHERE ref.id = gd.id;`,
    );
    return;
  },

  down: async QI => {
    await QI.sequelize.query(
      `WITH domains AS (
        SELECT id, domain->'name' as dom
        FROM "referrer-profiles", json_array_elements(settings -> 'domains') WITH ordinality arr(domain, index)
        WHERE domain->>'name' IS NOT NULL
      ),
      groupped_domains AS (
          SELECT id, jsonb_agg(dom) AS updated_domains
          FROM domains
          GROUP BY id
      )
      UPDATE public."referrer-profiles" AS ref
      SET settings = jsonb_set(settings::jsonb, '{domains}', gd.updated_domains)::json
      FROM groupped_domains AS gd
      WHERE ref.id = gd.id;`,
    );
    return;
  },
};
