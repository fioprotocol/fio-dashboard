import { useState } from 'react';

import apis from '../api';

import { VARS_KEYS, HEALTH_CHECK_TIME } from '../constants/vars';

import useEffectOnce from './general';
import { log } from '../util/general';
import { getIsPageVisible } from '../util/screen';

export default function useMaintenance(): [boolean, boolean] {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isPageVisible = getIsPageVisible();

  const checkHealthAndMaintenance = async () => {
    try {
      if (!navigator?.onLine || !isPageVisible) return;

      const healthResponse = await apis.healthCheck.ping();
      if (!healthResponse.success) {
        setIsMaintenance(true);
      }

      const varsResponse = await apis.vars.getVar(VARS_KEYS.IS_MAINTENANCE);
      setIsMaintenance(varsResponse.value !== 'false');
    } catch (error) {
      log.error(error);

      if (!navigator?.onLine || !isPageVisible) return;

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
