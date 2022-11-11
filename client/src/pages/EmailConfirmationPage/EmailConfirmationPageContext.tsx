import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { addManual as createNotification } from '../../redux/notifications/actions';
import {
  confirmEmail,
  resetEmailConfirmationResult,
} from '../../redux/profile/actions';
import { getInfo } from '../../redux/refProfile/actions';

import {
  emailConfirmationResult as emailConfirmationResultSelector,
  profileRefreshed as profileRefreshedSelector,
} from '../../redux/profile/selectors';

import { ROUTES } from '../../constants/routes';
import { ACTIONS } from '../../components/Notifications/Notifications';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import { NOTIFICATIONS_CONTENT_TYPE } from '../../constants/notifications';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import useEffectOnce from '../../hooks/general';
import useQuery from '../../hooks/useQuery';

export const useContext = () => {
  const emailConfirmationResult = useSelector(emailConfirmationResultSelector);
  const profileRefreshed = useSelector(profileRefreshedSelector);

  const dispatch = useDispatch();

  const history = useHistory();
  const queryParams = useQuery();

  const hash = queryParams.get(QUERY_PARAMS_NAMES.HASH);
  const refCode = queryParams.get(QUERY_PARAMS_NAMES.REF_CODE);

  const [confirmRequested, setConfirmRequested] = useState<boolean>(false);

  const isNotConfirmedEmail =
    typeof emailConfirmationResult.success === 'undefined';
  const emailConfirmed =
    emailConfirmationResult && emailConfirmationResult.success;

  const handleResult = useCallback(() => {
    dispatch(
      createNotification({
        action: ACTIONS.EMAIL_CONFIRM,
        type: BADGE_TYPES.INFO,
        contentType: NOTIFICATIONS_CONTENT_TYPE.ACCOUNT_CONFIRMATION,
        pagesToShow: [
          ROUTES.CART,
          ROUTES.CHECKOUT,
          ROUTES.FIO_ADDRESSES_SELECTION,
          ROUTES.FIO_DOMAINS_SELECTION,
          ROUTES.HOME,
          ROUTES.DASHBOARD,
        ],
      }),
    );
    history.replace(
      emailConfirmationResult.stateData?.redirectLink || ROUTES.DASHBOARD,
    );
  }, [dispatch, emailConfirmationResult.stateData?.redirectLink, history]);

  useEffect(() => {
    if (refCode != null && refCode !== '') {
      dispatch(getInfo(refCode));
    }
  }, [refCode, dispatch]);

  useEffect(() => {
    if (emailConfirmed) {
      handleResult();
    }
  }, [emailConfirmed, handleResult]);

  useEffect(() => {
    if (profileRefreshed && isNotConfirmedEmail && !confirmRequested) {
      setConfirmRequested(true);
      dispatch(confirmEmail(hash));
    }
  }, [
    confirmRequested,
    hash,
    history,
    isNotConfirmedEmail,
    profileRefreshed,
    dispatch,
  ]);

  useEffectOnce(() => () => dispatch(resetEmailConfirmationResult()), []);
};
