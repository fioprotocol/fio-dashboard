import { useCallback, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import { ROUTES } from '../../constants/routes';

import {
  isAffiliateEnabled as isAffiliateEnabledSelector,
  user as userSelector,
} from '../../redux/profile/selectors';
import { fioAddresses as fioAddressesSelector } from '../../redux/fio/selectors';

import { updateAffiliate } from '../../redux/profile/actions';

import useEffectOnce from '../../hooks/general';

import { FioAffiliateProgramPageContextProps, FormValuesProps } from './types';

export const useContext = (): FioAffiliateProgramPageContextProps => {
  const dispatch = useDispatch();
  const isAffiliateEnabled = useSelector(isAffiliateEnabledSelector);
  const user = useSelector(userSelector);
  const fioAddresses = useSelector(fioAddressesSelector);
  const history = useHistory();

  const [showModal, toggleShowModal] = useState(false);

  const onOpenModal = useCallback(() => toggleShowModal(true), []);
  const onCloseModal = useCallback(() => toggleShowModal(false), []);

  useEffectOnce(
    () => {
      if (!isAffiliateEnabled) {
        history.push({ pathname: ROUTES.FIO_AFFILIATE_PROGRAM_LANDING });
      }
    },
    [isAffiliateEnabled, history],
    !isAffiliateEnabled,
  );

  const onAffiliateUpdate = useCallback(
    (data: FormValuesProps) => {
      dispatch(updateAffiliate(data.fch));
      onCloseModal();
    },
    [dispatch, onCloseModal],
  );

  return {
    showModal,
    onCloseModal,
    onOpenModal,
    fioAddresses,
    onAffiliateUpdate,
    user,
    link: `${window.location.origin}/ref/${user?.affiliateProfile?.code}`,
    tpid: user?.affiliateProfile?.tpid,
  };
};
