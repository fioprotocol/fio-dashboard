import logger from '../logger.mjs';
import { createHash } from './crypto.mjs';

export const handleRefProfileApiTokenAndLegacyHash = async ({ apiToken, refProfile }) => {
  const generatedApiHash = createHash(apiToken);

  const apiHash = refProfile.apiHash;

  if (apiToken && generatedApiHash && apiHash) {
    if (generatedApiHash === apiHash) {
      logger.info(`Save API TOKEN to ${refProfile.code}`);
      await refProfile.update({ apiToken });
    }
  }
};
