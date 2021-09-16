import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RouterProps, withRouter } from 'react-router-dom';
import {
  checkAuthToken,
  setLastActivity,
  logout,
} from '../redux/profile/actions';
import { showLoginModal } from '../redux/modal/actions';
import { setRedirectPath } from '../redux/router/actions';

import { compose } from '../utils';
import {
  isAuthenticated,
  tokenCheckResult,
  lastActivityDate,
} from '../redux/profile/selectors';

type Props = {
  tokenCheckResult: boolean;
  lastActivityDate: number;
  isAuthenticated: boolean;
  checkAuthToken: () => void;
  setLastActivity: (value: number) => void;
  logout: (routerProps: RouterProps, redirect?: boolean) => void;
  showLoginModal: () => void;
  setRedirectPath: (route: string) => void;
};
const TIMEOUT = 5000; // 5 sec
const INACTIVITY_TIMEOUT = 1000 * 60 * 30; // 30 min

const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart',
];

const AutoLogout = (props: Props & RouterProps): React.FunctionComponent => {
  const {
    tokenCheckResult,
    lastActivityDate,
    isAuthenticated,
    history,
    checkAuthToken,
    setLastActivity,
    logout,
    showLoginModal,
    setRedirectPath,
  } = props;
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [intervalId, setIntervalId] = useState<ReturnType<
    typeof setInterval
  > | null>(null);
  const [localLastActivity, setLocalLastActivity] = useState<number>(
    new Date().getTime(),
  );

  useEffect(() => {
    if (isAuthenticated && !timeoutId) {
      checkToken();
    }
    if (isAuthenticated && !intervalId) {
      if (lastActivityDate) {
        const now = new Date();
        const lastActivity = new Date(lastActivityDate);
        if (now.getTime() - lastActivity.getTime() > INACTIVITY_TIMEOUT) {
          logout({ history }, false);
          return showLoginModal();
        }
      }
      activityWatcher();
    }
    if (!isAuthenticated && (timeoutId || intervalId)) {
      clearChecksTimeout();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (tokenCheckResult === null) return;
    if (tokenCheckResult) {
      checkToken();
    } else {
      clearChecksTimeout();
    }
  }, [tokenCheckResult]);

  useEffect(
    () => () => {
      timeoutId && clearTimeout(timeoutId);
      intervalId && clearInterval(intervalId);
    },
    [],
  );

  useEffect(() => {
    if (localLastActivity - lastActivityDate > TIMEOUT) {
      setLastActivity(localLastActivity);
    }
  }, [localLastActivity]);

  const checkToken = () => {
    const newTimeoutId: ReturnType<typeof setTimeout> = setTimeout(
      checkAuthToken,
      TIMEOUT,
    );
    setTimeoutId(newTimeoutId);
  };

  const clearChecksTimeout = () => {
    timeoutId && clearTimeout(timeoutId);
    intervalId && clearInterval(intervalId);
    setTimeoutId(null);
    setIntervalId(null);
  };

  const activityTimeout = (listener: () => void) => {
    ACTIVITY_EVENTS.forEach((eventName: string): void => {
      document.removeEventListener(eventName, listener, true);
    });
    const {
      history: {
        location: { pathname },
      },
    } = props;
    setRedirectPath(pathname);
    logout({ history }, false);
    showLoginModal();
  };

  const activityWatcher = () => {
    let secondsSinceLastActivity = 0;

    const activity = () => {
      console.info('===ACTIVITY===');
      secondsSinceLastActivity = 0;
      setLocalLastActivity(new Date().getTime());
    };

    const newIntervalId: ReturnType<typeof setInterval> = setInterval(() => {
      secondsSinceLastActivity += TIMEOUT;
      console.info(
        '===secondsSinceLastActivity===',
        secondsSinceLastActivity,
        secondsSinceLastActivity > INACTIVITY_TIMEOUT,
      );
      if (secondsSinceLastActivity > INACTIVITY_TIMEOUT) {
        console.info('===TIMEOUTED===');
        activityTimeout(activity);
      }
    }, TIMEOUT);
    setIntervalId(newIntervalId);

    ACTIVITY_EVENTS.forEach((eventName: string): void => {
      document.addEventListener(eventName, activity, true);
    });
  };

  return null;
};

const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
    lastActivityDate,
    tokenCheckResult,
  }),
  {
    setLastActivity,
    checkAuthToken,
    logout,
    showLoginModal,
    setRedirectPath,
  },
);

export default withRouter(compose(reduxConnect)(AutoLogout));
