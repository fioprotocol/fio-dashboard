import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RouterProps, withRouter } from 'react-router-dom';

import {
  checkAuthToken,
  setLastActivity,
  logout,
} from '../redux/profile/actions';
import { setRedirectPath } from '../redux/navigation/actions';
import {
  isAuthenticated,
  tokenCheckResult,
  lastActivityDate,
  profileRefreshed,
} from '../redux/profile/selectors';
import { redirectLink } from '../redux/navigation/selectors';

import { compose } from '../utils';
import useEffectOnce from '../hooks/general';

import { RedirectLinkData, Unknown } from '../types';

type Props = {
  tokenCheckResult: boolean;
  lastActivityDate: number;
  isAuthenticated: boolean;
  profileRefreshed: boolean;
  redirectLink: RedirectLinkData;
  checkAuthToken: () => void;
  setLastActivity: (value: number) => void;
  logout: (routerProps: RouterProps & { auto?: boolean }) => void;
  setRedirectPath: (route: RedirectLinkData) => void;
};
const TIMEOUT = 5000; // 5 sec
const INACTIVITY_TIMEOUT = process.env.REACT_APP_INACTIVITY_TIMEOUT
  ? parseInt(process.env.REACT_APP_INACTIVITY_TIMEOUT)
  : 1000 * 60 * 30; // 30 min
const DEBUG_MODE = !!process.env.REACT_APP_DEBUG_AUTOLOGOUT;

const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart',
];

let activityMethod: (() => {} | void) | null = null;
let activityTimeout: () => {} | void | null = () => null;

const removeActivityListener = () => {
  try {
    ACTIVITY_EVENTS.forEach((eventName: string): void => {
      document.removeEventListener(
        eventName,
        activityMethod as EventListenerOrEventListenerObject,
        true,
      );
    });
  } catch (e) {
    //
  }
};

const logEvent = (...params: Unknown[]) => {
  if (!DEBUG_MODE) return;
  // eslint-disable-next-line no-console
  console.info(...params);
};

const AutoLogout = (
  props: Props &
    RouterProps & { history: { location: { query: Record<string, string> } } }, // todo: fixed in react router 6.9.1
): React.FunctionComponent | null => {
  const {
    tokenCheckResult,
    lastActivityDate,
    isAuthenticated,
    profileRefreshed,
    redirectLink,
    history,
    checkAuthToken,
    setLastActivity,
    logout,
    setRedirectPath,
  } = props;

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initLoad = useMemo(
    () => profileRefreshed && isAuthenticated && !!lastActivityDate,
    [profileRefreshed, isAuthenticated, lastActivityDate],
  );
  const [localLastActivity, setLocalLastActivity] = useState<number>(
    new Date().getTime(),
  );

  const redirectParams = redirectLink || history.location;

  const clearChecksTimeout = () => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    intervalRef.current && clearInterval(intervalRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
    if (activityMethod) {
      removeActivityListener();
    }
  };

  activityTimeout = useCallback(() => {
    removeActivityListener();
    setRedirectPath(redirectParams);
    logout({ history, auto: true });
    clearChecksTimeout();
  }, [history, redirectParams, logout, setRedirectPath]);

  const activityWatcher = () => {
    let lastActivity = new Date().getTime();

    activityMethod = () => {
      const secondsSinceLastActivity = new Date().getTime() - lastActivity;
      if (secondsSinceLastActivity > INACTIVITY_TIMEOUT) {
        return activityTimeout();
      }
      lastActivity = new Date().getTime();
      setLocalLastActivity(lastActivity);
    };

    intervalRef.current = setInterval(() => {
      const secondsSinceLastActivity = new Date().getTime() - lastActivity;
      logEvent(
        '===secondsSinceLastActivity===',
        secondsSinceLastActivity,
        INACTIVITY_TIMEOUT,
        secondsSinceLastActivity > INACTIVITY_TIMEOUT,
        new Date(),
      );
      if (secondsSinceLastActivity > INACTIVITY_TIMEOUT) {
        logEvent('===TIMEOUTED===');
        activityTimeout();
      }
    }, TIMEOUT);

    ACTIVITY_EVENTS.forEach((eventName: string): void => {
      document.addEventListener(
        eventName,
        activityMethod as EventListenerOrEventListenerObject,
        true,
      );
    });
  };

  const checkToken = useCallback(() => {
    timeoutRef.current = setTimeout(checkAuthToken, TIMEOUT);
  }, [checkAuthToken]);

  useEffect(
    () => () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
      intervalRef.current && clearInterval(intervalRef.current);
      timeoutRef.current = null;
      intervalRef.current = null;
    },
    [],
  );

  useEffect(() => {
    if (isAuthenticated && !timeoutRef.current) {
      checkToken();
    }
    if (isAuthenticated && !intervalRef.current) {
      activityWatcher();
    }
    if (!isAuthenticated && (timeoutRef.current || intervalRef.current)) {
      clearChecksTimeout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkToken, isAuthenticated]);

  // Auto-logout when page loaded
  useEffectOnce(
    () => {
      const now = new Date();
      const lastActivity = new Date(lastActivityDate);
      if (now.getTime() - lastActivity.getTime() > INACTIVITY_TIMEOUT) {
        logout({ history, auto: true });
      }
    },
    [lastActivityDate, history, logout],
    initLoad,
  );

  useEffect(() => {
    if (tokenCheckResult === null) return;
    if (tokenCheckResult) {
      checkToken();
    } else {
      clearChecksTimeout();
      activityTimeout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenCheckResult, checkToken]);

  useEffect(() => {
    if (profileRefreshed && localLastActivity - lastActivityDate > TIMEOUT) {
      logEvent('===ACTIVITY===');
      setLastActivity(localLastActivity);
    }
  }, [lastActivityDate, localLastActivity, profileRefreshed, setLastActivity]);

  return null;
};

const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
    lastActivityDate,
    tokenCheckResult,
    profileRefreshed,
    redirectLink,
  }),
  {
    setLastActivity,
    checkAuthToken,
    logout,
    setRedirectPath,
  },
);

export default withRouter(compose(reduxConnect)(AutoLogout));
