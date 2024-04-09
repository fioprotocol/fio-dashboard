import { useState } from 'react';

import apis from '../api';

import { VARS_KEYS, HEALTH_CHECK_TIME } from '../constants/vars';
import { HIDDEN_PAGE_SKIP_MESSAGE } from '../constants/errors';

import useEffectOnce from './general';
import { log } from '../util/general';

export default function useMaintenance() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkHealthAndMaintenance = async () => {
    try {
      if (!navigator?.onLine) return;

      const healthResponse = await apis.healthCheck.ping();
      if (!healthResponse.success) {
        setIsMaintenance(true);
      }

      const varsResponse = await apis.vars.getVar(VARS_KEYS.IS_MAINTENANCE);
      setIsMaintenance(varsResponse.value !== 'false');
    } catch (error) {
      log.error(error);

      if (!navigator?.onLine || error?.message === HIDDEN_PAGE_SKIP_MESSAGE)
        return;

      setIsMaintenance(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffectOnce(() => {
    setIsLoading(true);
    checkHealthAndMaintenance();
    const healthCheckInterval = setInterval(() => {
      checkHealthAndMaintenance();
    }, HEALTH_CHECK_TIME);

    return () => clearInterval(healthCheckInterval);
  }, []);

  return [isMaintenance, isLoading];
}
