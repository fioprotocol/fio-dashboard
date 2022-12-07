import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ROUTES } from '../../constants/routes';

import {
  loading as loadingSelector,
  isAffiliateEnabled as isAffiliateEnabledSelector,
  isAuthenticated as isAuthenticatedSelector,
} from '../../redux/profile/selectors';
import { fioAddresses as fioAddressesSelector } from '../../redux/fio/selectors';

import { setRedirectPath } from '../../redux/navigation/actions';
import { showLoginModal } from '../../redux/modal/actions';
import { activateAffiliate as activateAffiliateAction } from '../../redux/profile/actions';

import useEffectOnce from '../../hooks/general';

import { FioAffiliateProgramLandingPageContextProps } from './types';

export const useContext = (): FioAffiliateProgramLandingPageContextProps => {
  const dispatch = useDispatch();
  const loading = useSelector(loadingSelector);
  const isAffiliateEnabled = useSelector(isAffiliateEnabledSelector);
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const fioAddresses = useSelector(fioAddressesSelector);
  const [showModal, toggleShowModal] = useState(false);
  const onOpenModal = useCallback(() => toggleShowModal(true), []);
  const onCloseModal = useCallback(() => toggleShowModal(false), []);

  useEffectOnce(
    () => {
      if (!isAuthenticated) {
        dispatch(
          setRedirectPath({ pathname: ROUTES.FIO_AFFILIATE_PROGRAM_LANDING }),
        );
      }
    },
    [isAuthenticated, setRedirectPath],
    !isAuthenticated,
  );

  return {
    loading,
    isAuthenticated,
    isAffiliateEnabled,
    showLogin: () => dispatch(showLoginModal()),
    fioAddresses,
    activateAffiliate: (fch: string) => dispatch(activateAffiliateAction(fch)),
    showModal,
    onOpenModal,
    onCloseModal,
  };
};
