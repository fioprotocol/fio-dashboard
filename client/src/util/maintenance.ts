// A transient network error (proxy 502, timeout) must not flip the whole app
// into the maintenance screen. Only the IS_MAINTENANCE var is authoritative;
// failed checks count only after this many in a row.
export const MAINTENANCE_FAILURE_THRESHOLD = 3;
export const MAINTENANCE_REQUEST_TIMEOUT_MS = 10000;

export type MaintenanceState = {
  isMaintenance: boolean;
  consecutiveFailures: number;
};

export type MaintenanceCheckResult = {
  // IS_MAINTENANCE var is exactly 'true'
  maintenanceFlag: boolean;
  // /ping reported unhealthy, or /ping or /vars failed or timed out
  hasFailure: boolean;
};

export const INITIAL_MAINTENANCE_STATE: MaintenanceState = {
  isMaintenance: false,
  consecutiveFailures: 0,
};

export const isMaintenanceVarOn = (value: unknown): boolean => value === 'true';

export const nextMaintenanceState = (
  prev: MaintenanceState,
  { maintenanceFlag, hasFailure }: MaintenanceCheckResult,
): MaintenanceState => {
  if (maintenanceFlag) return { isMaintenance: true, consecutiveFailures: 0 };

  if (hasFailure) {
    const consecutiveFailures = prev.consecutiveFailures + 1;
    return {
      isMaintenance: consecutiveFailures >= MAINTENANCE_FAILURE_THRESHOLD,
      consecutiveFailures,
    };
  }

  return { ...INITIAL_MAINTENANCE_STATE };
};

export const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Request timed out after ${ms}ms`)),
      ms,
    );

    promise.then(
      value => {
        clearTimeout(timer);
        resolve(value);
      },
      error => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
