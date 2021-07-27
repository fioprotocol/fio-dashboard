import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { checkAuthToken } from '../redux/profile/actions';

import { compose } from '../utils';
import { isAuthenticated, tokenCheckResult } from '../redux/profile/selectors';

type Props = {
  tokenCheckResult: boolean;
  isAuthenticated: boolean;
  checkAuthToken: () => void;
};
const TIMEOUT = 5000; // 5 sec

const AutoLogout = (props: Props): React.FunctionComponent => {
  const { tokenCheckResult, isAuthenticated, checkAuthToken } = props;
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const checkToken = () => {
    const newTimeoutId: ReturnType<typeof setTimeout> = setTimeout(
      checkAuthToken,
      TIMEOUT,
    );
    setTimeoutId(newTimeoutId);
  };

  const clearCheckTimeout = () => {
    timeoutId && clearTimeout(timeoutId);
    setTimeoutId(null);
  };

  useEffect(() => {
    if (isAuthenticated && !timeoutId) {
      checkToken();
    }
    if (!isAuthenticated && timeoutId) {
      clearCheckTimeout();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (tokenCheckResult === null) return;
    if (tokenCheckResult) {
      checkToken();
    } else {
      clearCheckTimeout();
    }
  }, [tokenCheckResult]);

  useEffect(() => () => timeoutId && clearInterval(timeoutId), []);

  return null;
};

const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
    tokenCheckResult,
  }),
  {
    checkAuthToken,
  },
);

export default withRouter(compose(reduxConnect)(AutoLogout));
