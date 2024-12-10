import logger from '../logger.mjs';
import { createHash } from './crypto.mjs';

export const handleRefProfileApiTokenAndLegacyHash = async ({
  apiToken,
  refProfileApiData,
  refCode,
}) => {
  const generatedApiHash = createHash(apiToken);

  const apiHash = refProfileApiData.legacyHash;

  if (apiToken && generatedApiHash && apiHash) {
    if (generatedApiHash === apiHash) {
      logger.info(`Save API TOKEN to ${refCode}`);
      await refProfileApiData.update({ token: apiToken });
    }
  }
};
