import { useState } from 'react';

import apis from '../api';

import { VARS_KEYS } from '../constants/vars';

import useEffectOnce from './general';

export default function useMaintenance() {
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffectOnce(() => {
    apis.vars
      .getVar(VARS_KEYS.IS_MAINTENANCE)
      .then((data: any) => {
        setIsMaintenance(data.value == 'false' ? false : true);
      })
      .catch((err: any) => {
        setIsMaintenance(true);
      });

    const healthCheckInterval = setInterval(() => {
      apis.healthCheck
        .ping()
        .then((data: any) => {
          if (!data.success) {
            setIsMaintenance(true);
          }
        })
        .catch((err: any) => {
          setIsMaintenance(true);
        });
    }, 10000);

    return () => clearInterval(healthCheckInterval);
  }, []);

  return [isMaintenance];
}
