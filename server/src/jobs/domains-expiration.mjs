import '../db';
import { Domain, ReferrerProfile } from '../models/index.mjs';

import CommonJob from './job.mjs';

import { fioApi } from '../external/fio.mjs';

import logger from '../logger.mjs';

class DomainsExpirationJob extends CommonJob {
  async execute() {
    try {
      const dashboardDomains = await Domain.findAll({
        where: {
          isDashboardDomain: true,
        },
      });
      const refProfiles = await ReferrerProfile.findAll({
        where: {
          type: ReferrerProfile.TYPE.REF,
        },
      });

      const dashboardDomainPromises = dashboardDomains.map(async domainItem => {
        const domainName = domainItem.name;

        try {
          // Fetch domain details from external API
          const domainFromChain = await fioApi.getFioDomain(domainName);

          if (!domainFromChain) {
            domainItem.expirationDate = null;
          } else {
            domainItem.expirationDate = domainFromChain.expiration;
          }

          // Update domain status in the database
          await domainItem.save();
        } catch (error) {
          logger.error(`HANDLE EXPIRED DASHBOARD DOMAIN ${domainName} ERROR:`, error);
        }
      });

      const refProfilePromises = refProfiles.map(async refProfileItem => {
        const refProfileCode = refProfileItem.code;

        try {
          const domains = refProfileItem.settings && refProfileItem.settings.domains;

          if (domains) {
            await Promise.all(
              domains.map(async domainItem => {
                const domainName = domainItem.name;

                try {
                  const domainFromChain = await fioApi.getFioDomain(domainName);

                  if (!domainFromChain) {
                    domainItem.expirationDate = null;
                  } else {
                    domainItem.expirationDate = domainFromChain.expiration;
                  }
                } catch (error) {
                  logger.error(
                    `HANDLE EXPIRED REF PROFILE DOMAIN ${domainName} ERROR:`,
                    error,
                  );
                }
              }),
            );

            refProfileItem.settings = { ...refProfileItem.settings };
            await refProfileItem.save();
          }
        } catch (error) {
          logger.error(`HANDLE EXPIRED REF PROFILE ${refProfileCode} ERROR:`, error);
        }
      });

      // Wait for all promises to resolve
      await Promise.all(dashboardDomainPromises);
      await Promise.all(refProfilePromises);
    } catch (error) {
      logger.error('GET DOMAINS ERROR', error);
    }

    this.postMessage(`DOMAINS EXPIRATION DATES HAS BEEN UPDATED`);

    this.finish();
  }
}

new DomainsExpirationJob().execute();
