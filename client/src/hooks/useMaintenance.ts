import { useState } from 'react';

import apis from '../api';
import { HealthCheckResponse, VarsResponse } from '../api/responses';

import { REACT_SNAP_AGENT } from '../constants/twitter';
import { VARS_KEYS, HEALTH_CHECK_TIME } from '../constants/vars';

import useEffectOnce from './general';

export default function useMaintenance() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkHealthAndMaintenance = () => {
    apis.healthCheck
      .ping()
      .then((data: HealthCheckResponse) => {
        if (!data.success) {
          setIsMaintenance(true);
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsMaintenance(true);
        setIsLoading(false);
      });

    apis.vars
      .getVar(VARS_KEYS.IS_MAINTENANCE)
      .then((data: VarsResponse) => {
        setIsMaintenance(data.value === 'false' ? false : true);
        setIsLoading(false);
      })
      .catch(() => {
        setIsMaintenance(true);
        setIsLoading(false);
      });
  };

  useEffectOnce(() => {
    if (navigator.userAgent === REACT_SNAP_AGENT) return;
    setIsLoading(true);
    checkHealthAndMaintenance();
    const healthCheckInterval = setInterval(() => {
      checkHealthAndMaintenance();
    }, HEALTH_CHECK_TIME);

    return () => clearInterval(healthCheckInterval);
  }, []);

  return [isMaintenance, isLoading];
}
