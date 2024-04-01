import { FIO_ADDRESS_DELIMITER } from '../config/constants';
import { DOMAIN_EXP_DEBUG_AFFIX, DOMAIN_EXP_IN_30_DAYS } from '../constants/fio.mjs';

import { convertToNewDate } from './general.mjs';
import { fioApi } from '../external/fio.mjs';
import logger from '../logger.mjs';

export const isDomain = fioName => fioName.indexOf(FIO_ADDRESS_DELIMITER) < 0;

export const isDomainExpired = (domainName, expiration) => {
  if (
    process.env.EMAILS_JOB_SIMULATION_EXPIRING_DOMAIN_ENABLED === 'true' &&
    domainName.includes(DOMAIN_EXP_DEBUG_AFFIX) &&
    !domainName.includes(DOMAIN_EXP_IN_30_DAYS)
  ) {
    return true;
  }

  const today = new Date();

  const expirationDay = new Date(convertToNewDate(expiration));

  expirationDay.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return expirationDay <= today;
};

export const handleExpiredDomains = async ({ domainsList }) => {
  for (const domainItem of domainsList) {
    if (domainItem && domainItem.name) {
      try {
        const domainFromChain = await fioApi.getFioDomain(domainItem.name);

        if (!domainFromChain) {
          domainItem.isExpired = true;
        } else {
          const { expiration } = domainFromChain;

          const isExpired = isDomainExpired(domainItem.name, expiration);

          if (isExpired) {
            domainItem.isExpired = true;
          }
        }
      } catch (error) {
        logger.error('HANDLE EXPIRED DOMAIN ERROR:', error);
        domainItem.isExpired = true;
      }
    }
  }
  return domainsList;
};
