import { useState } from 'react';

import apis from '../api';
import { HealthCheckResponse, VarsResponse } from '../api/responses';

import { VARS_KEYS, HEALTH_CHECK_TIME } from '../constants/vars';

import useEffectOnce from './general';

export default function useMaintenance() {
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffectOnce(() => {
    apis.vars
      .getVar(VARS_KEYS.IS_MAINTENANCE)
      .then((data: VarsResponse) => {
        setIsMaintenance(data.value == 'false' ? false : true);
      })
      .catch(() => {
        setIsMaintenance(true);
      });

    const healthCheckInterval = setInterval(() => {
      apis.healthCheck
        .ping()
        .then((data: HealthCheckResponse) => {
          if (!data.success) {
            setIsMaintenance(true);
          }
        })
        .catch(() => {
          setIsMaintenance(true);
        });
    }, HEALTH_CHECK_TIME);

    return () => clearInterval(healthCheckInterval);
  }, []);

  return [isMaintenance];
}
