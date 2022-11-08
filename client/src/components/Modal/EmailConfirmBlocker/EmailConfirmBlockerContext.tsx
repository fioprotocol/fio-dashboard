import { MouseEvent, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { resendConfirmEmail } from '../../../redux/profile/actions';

import {
  emailConfirmationSent as emailConfirmationSentSelector,
  emailConfirmationToken as emailConfirmationTokenSelector,
  isAuthenticated as isAuthenticatedSelector,
  isActiveUser as isActiveUserSelector,
  loading as loadingSeletor,
} from '../../../redux/profile/selectors';
import { redirectLink as redirectLinkSelector } from '../../../redux/navigation/selectors';
import { refProfileInfo as refProfileInfoSelector } from '../../../redux/refProfile/selectors';

import {
  isContainedFlow as isContainedFlowSelector,
  containedFlowQueryParams as containedFlowQueryParamsSelector,
} from '../../../redux/containedFlow/selectors';

import { ROUTES } from '../../../constants/routes';

import { EmailConfirmationStateData } from '../../../types';

type ContextProps = {
  emailConfirmationSentTitle: string;
  loading: boolean;
  onSend: (e: MouseEvent<HTMLElement>) => void;
};

export const useContext = (): ContextProps => {
  const emailConfirmationSent = useSelector(emailConfirmationSentSelector);
  const emailConfirmationToken = useSelector(emailConfirmationTokenSelector);
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const isActiveUser = useSelector(isActiveUserSelector);
  const isContainedFlow = useSelector(isContainedFlowSelector);
  const containedFlowQueryParams = useSelector(
    containedFlowQueryParamsSelector,
  );
  const loading = useSelector(loadingSeletor);
  const redirectLink = useSelector(redirectLinkSelector);
  const refProfileInfo = useSelector(refProfileInfoSelector);

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    if (isAuthenticated && isActiveUser) {
      history.replace(ROUTES.CONFIRM_EMAIL_RESULT);
    }

    if (!isAuthenticated) {
      history.replace(ROUTES.HOME);
    }
  }, [isAuthenticated, isActiveUser, redirectLink, history]);

  const onSend = useCallback((e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    let stateData: EmailConfirmationStateData = {
      redirectLink: redirectLink ? redirectLink.pathname : '',
    };
    if (isContainedFlow) {
      stateData = {
        ...stateData,
        refCode: refProfileInfo?.code,
        containedFlowQueryParams,
      };
    }
    dispatch(resendConfirmEmail(emailConfirmationToken, stateData));
  }, []);

  const emailConfirmationSentTitle = emailConfirmationSent ? 'Email sent' : '';

  return {
    emailConfirmationSentTitle,
    loading,
    onSend,
  };
};
