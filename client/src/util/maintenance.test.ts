import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import {
  INITIAL_MAINTENANCE_STATE,
  MAINTENANCE_FAILURE_THRESHOLD,
  MaintenanceCheckResult,
  isMaintenanceVarOn,
  nextMaintenanceState,
  withTimeout,
} from './maintenance';

const OK: MaintenanceCheckResult = {
  maintenanceFlag: false,
  hasFailure: false,
};
const FAIL: MaintenanceCheckResult = {
  maintenanceFlag: false,
  hasFailure: true,
};
const FLAG: MaintenanceCheckResult = {
  maintenanceFlag: true,
  hasFailure: false,
};

const run = (results: MaintenanceCheckResult[]) =>
  results.reduce(nextMaintenanceState, INITIAL_MAINTENANCE_STATE);

describe('isMaintenanceVarOn', () => {
  it("is on only for the exact string 'true'", () => {
    expect(isMaintenanceVarOn('true')).toBe(true);
    expect(isMaintenanceVarOn('false')).toBe(false);
    expect(isMaintenanceVarOn(undefined)).toBe(false);
    expect(isMaintenanceVarOn(null)).toBe(false);
    expect(isMaintenanceVarOn('')).toBe(false);
  });
});

describe('nextMaintenanceState', () => {
  it('a simulated /vars 502 shows maintenance only on the 3rd consecutive failure', () => {
    expect(MAINTENANCE_FAILURE_THRESHOLD).toBe(3);
    expect(run([FAIL]).isMaintenance).toBe(false);
    expect(run([FAIL, FAIL]).isMaintenance).toBe(false);
    expect(run([FAIL, FAIL, FAIL]).isMaintenance).toBe(true);
  });

  it('a successful check resets the failure streak', () => {
    expect(run([FAIL, FAIL, OK, FAIL, FAIL]).isMaintenance).toBe(false);
    expect(run([FAIL, FAIL, FAIL, OK]).isMaintenance).toBe(false);
  });

  it('IS_MAINTENANCE=true is authoritative and immediate', () => {
    expect(run([FLAG]).isMaintenance).toBe(true);
    expect(
      run([{ maintenanceFlag: true, hasFailure: true }]).isMaintenance,
    ).toBe(true);
    expect(run([FLAG, OK]).isMaintenance).toBe(false);
  });

  it('an unhealthy /ping counts as a failure even when /vars says false', () => {
    // Previously the /vars result overwrote the /ping result.
    expect(run([FAIL, FAIL, FAIL]).consecutiveFailures).toBe(3);
  });
});

describe('withTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('rejects when the request hangs', async () => {
    const pending = withTimeout(new Promise(() => undefined), 1000);
    jest.advanceTimersByTime(1000);
    await expect(pending).rejects.toThrow('timed out');
  });

  it('resolves with the response when it arrives in time', async () => {
    await expect(withTimeout(Promise.resolve('ok'), 1000)).resolves.toBe('ok');
  });
});
