'use strict';

const crypto = require('crypto');

const superagent = require('superagent');
const { Account } = require('@fioprotocol/fiosdk');

module.exports = {
  up: async (QI, DT) => {
    const tableInfo = await QI.describeTable('domains');
    const expirationDateColumnExists = !!tableInfo.expirationDate;

    if (!expirationDateColumnExists) {
      await QI.addColumn('domains', 'expirationDate', {
        type: DT.STRING,
      });
    }

    const GET_TABLE_ROWS_URL = `${process.env.FIO_BASE_URL}chain/get_table_rows`;

    const getTableRows = async params => {
      try {
        const response = await superagent.post(GET_TABLE_ROWS_URL).send(params);

        const { rows, more } = response.body;

        return { rows, more };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        throw error;
      }
    };

    const setTableRowsParams = fioName => {
      const hash = crypto.createHash('sha1');
      const bound =
        '0x' +
        hash
          .update(fioName)
          .digest()
          .slice(0, 16)
          .reverse()
          .toString('hex');

      const params = {
        code: Account.address,
        scope: Account.address,
        table: 'domains',
        lower_bound: bound,
        upper_bound: bound,
        key_type: 'i128',
        index_position: '4',
        json: true,
      };

      return params;
    };

    const getFioDomain = async domainName => {
      try {
        const tableRowsParams = setTableRowsParams(domainName);

        const { rows } = await getTableRows(tableRowsParams);

        return rows.length ? rows[0] : null;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };

    const dashboardDomains = await QI.sequelize.query(
      `
        SELECT *
        FROM domains
        WHERE "isDashboardDomain" = true;
      `,
      { type: QI.sequelize.QueryTypes.SELECT },
    );

    for (const domain of dashboardDomains) {
      const { id, name } = domain;

      const domainFromChain = await getFioDomain(name);

      let expirationDate = null;

      if (domainFromChain) {
        expirationDate = domainFromChain.expiration;
      }

      // Execute an update query to update the expirationDate for the domain
      await QI.sequelize.query(
        `
          UPDATE domains
          SET "expirationDate" = :expirationDate
          WHERE id = :id;
        `,
        {
          replacements: { expirationDate, id },
          type: QI.sequelize.QueryTypes.UPDATE,
        },
      );
    }

    const refProfiles = await QI.sequelize.query(
      `
        SELECT *
        FROM "referrer-profiles"
        WHERE type = 'REFERRER';
      `,
      { type: QI.sequelize.QueryTypes.SELECT },
    );

    for (const refProfile of refProfiles) {
      const { id, settings } = refProfile;

      if (settings && settings.domains) {
        const handledExpiredDomains = [];

        const refDomains = settings.domains;

        if (refDomains) {
          for (const refDomain of refDomains) {
            const domainName = refDomain.name;
            if (domainName) {
              const domainFromChain = await getFioDomain(domainName);

              if (domainFromChain) {
                refDomain.expirationDate = domainFromChain.expiration;
              }
            }
            handledExpiredDomains.push(refDomain);
          }

          await QI.sequelize.query(
            `
              UPDATE "referrer-profiles"
              SET settings = jsonb_set(settings::jsonb, '{domains}', :handledExpiredDomains::jsonb)
              WHERE id = :id;
            `,
            {
              replacements: {
                handledExpiredDomains: JSON.stringify(handledExpiredDomains),
                id,
              },
              type: QI.sequelize.QueryTypes.UPDATE,
            },
          );
        }
      }
    }

    return;
  },

  down: async QI => {
    await QI.removeColumn('domains', 'expirationDate');

    await QI.sequelize.query(`
      UPDATE "referrer-profiles"
      SET settings = jsonb_set(
          settings::jsonb,
          '{domains}',
          (
              SELECT jsonb_agg(domain::jsonb #- '{expirationDate}')
              FROM json_array_elements(settings->'domains') AS domain
          ),
          true
      )::json
      WHERE settings->'domains' IS NOT NULL;
    `);
  },
};
