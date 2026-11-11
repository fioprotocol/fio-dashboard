import { useRef, useState } from 'react';

import apis from '../api';

import { VARS_KEYS, HEALTH_CHECK_TIME } from '../constants/vars';

import useEffectOnce from './general';
import { log } from '../util/general';
import { getIsPageVisible } from '../util/screen';
import {
  INITIAL_MAINTENANCE_STATE,
  MAINTENANCE_REQUEST_TIMEOUT_MS,
  MaintenanceState,
  isMaintenanceVarOn,
  nextMaintenanceState,
  withTimeout,
} from '../util/maintenance';

export default function useMaintenance(): [boolean, boolean] {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const stateRef = useRef<MaintenanceState>(INITIAL_MAINTENANCE_STATE);
  const inFlightRef = useRef(false);

  const checkHealthAndMaintenance = async () => {
    // The request timeout is longer than the tick interval: skip overlapping ticks.
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      // Read on every tick: a value captured at mount goes stale.
      if (!navigator?.onLine || !getIsPageVisible()) return;

      let hasFailure = false;
      let maintenanceFlag = false;

      try {
        const healthResponse = await withTimeout(
          apis.healthCheck.ping(),
          MAINTENANCE_REQUEST_TIMEOUT_MS,
        );
        if (!healthResponse?.success) hasFailure = true;
      } catch (error) {
        log.error(error);
        hasFailure = true;
      }

      try {
        const varsResponse = await withTimeout(
          apis.vars.getVar(VARS_KEYS.IS_MAINTENANCE),
          MAINTENANCE_REQUEST_TIMEOUT_MS,
        );
        maintenanceFlag = isMaintenanceVarOn(varsResponse?.value);
      } catch (error) {
        log.error(error);
        hasFailure = true;
      }

      // The tab may have gone offline or hidden while the requests ran.
      if (hasFailure && (!navigator?.onLine || !getIsPageVisible())) return;

      stateRef.current = nextMaintenanceState(stateRef.current, {
        maintenanceFlag,
        hasFailure,
      });
      setIsMaintenance(stateRef.current.isMaintenance);
    } finally {
      inFlightRef.current = false;
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
