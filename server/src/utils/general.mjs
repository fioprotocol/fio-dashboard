import fetch from 'node-fetch';

import logger from '../logger.mjs';
import { sleep } from '../tools.mjs';
import { HTTP_CODES } from '../constants/general.mjs';
import { RATE_LIMIT_TYPE_ERROR } from '../constants/errors.mjs';
import { MINUTE_MS, SECOND_MS } from '../config/constants';
import MathOp from '../services/math.mjs';

export function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

export const convertToNewDate = timestampOrDateString => {
  const timestampNumber = Number(timestampOrDateString);

  if (!isNaN(timestampNumber)) {
    // If it's a valid numeric timestamp (seconds or milliseconds)
    if (timestampNumber.toString().length === 13) {
      // It's in milliseconds
      return new Date(timestampNumber);
    } else {
      // It's in seconds, convert to milliseconds
      return new Date(timestampNumber * 1000);
    }
  }

  // If it's not a valid numeric timestamp, try parsing as Date string
  const date = new Date(timestampOrDateString);
  if (!isNaN(date.getTime())) {
    return date;
  }

  // If it's neither a valid timestamp nor a valid Date string
  throw new Error('Invalid input: Unable to convert to Date.');
};

export const fetchWithRateLimit = async ({
  url,
  options = {},
  backupUrl = null,
  maxRetries = 1,
}) => {
  let retries = 0;

  const makeRequest = async ({ targetUrl, isBackupRetry }) => {
    try {
      const response = await fetch(targetUrl, options);

      if (response.ok) return response;

      if (response.status === HTTP_CODES.TOO_MANY_REQUESTS) {
        if (retries > maxRetries) {
          throw new Error(
            `${RATE_LIMIT_TYPE_ERROR}: Max retries (${maxRetries}) reached`,
          );
        }

        retries++;
        const backoffDelay =
          retries === maxRetries ? MINUTE_MS : SECOND_MS * Math.pow(2, retries - 1); // Exponential backoff

        logger.info(
          `RATE LIMIT FOR URL: ${targetUrl} ${
            options ? `OPTIONS: ${JSON.stringify(options)}` : ''
          }`,
        );
        logger.info(`RETRY count: ${retries}, waiting ${backoffDelay}ms`);

        await sleep(backoffDelay);
        return makeRequest({ targetUrl });
      }

      const responseJSON = response ? await response.json() : null;

      throw new Error(
        `HTTP error! status: ${response.status}, response: ${
          responseJSON ? JSON.stringify(responseJSON, null, 4) : 'N/A'
        }`,
      );
    } catch (error) {
      if (!isBackupRetry && backupUrl) {
        logger.error(error, 'Fetch server failed');

        retries = 0; // Reset retries count for backup url
        logger.info(`RUNING backup server: ${backupUrl}`);

        return makeRequest({ targetUrl: backupUrl, isBackupRetry: true });
      }

      throw error;
    }
  };

  try {
    return await makeRequest({ targetUrl: url });
  } catch (error) {
    logger.error(error, 'Fetch with rate limit failed');
    throw error;
  }
};

export const compareTimestampsWithThreshold = (timestamp1, timestamp2) => {
  // Convert timestamps to milliseconds
  const getMilliseconds = timestamp => {
    if (typeof timestamp === 'number') {
      // Convert Unix timestamp to milliseconds
      return new MathOp(timestamp).mul(SECOND_MS);
    }
    // Convert ISO string to milliseconds
    return new MathOp(new Date(timestamp).getTime());
  };

  const time1 = getMilliseconds(timestamp1);
  const time2 = getMilliseconds(timestamp2);

  // Calculate absolute difference in seconds
  const diffInSeconds = time1
    .sub(time2)
    .abs()
    .div(SECOND_MS);

  // Compare with threshold of 1 second
  return diffInSeconds.lte(1);
};
