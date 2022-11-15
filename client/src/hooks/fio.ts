import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { resetMappedPubAddressError } from '../redux/fio/actions';

import { getMappedPubAddressError as getMappedPubAddressErrorSelector } from '../redux/fio/selectors';

import { NOT_FOUND } from '../constants/errors';
import { ROUTES } from '../constants/routes';

const REDIRECT_TIMEOUT = 500;

export const useGetMappedErrorRedirect = async (
  fioCryptoHandleName: string | null,
): Promise<void> => {
  const history = useHistory();
  const dispatch = useDispatch();

  const getMappedPubAddressError = useSelector(
    getMappedPubAddressErrorSelector,
  );

  useEffect(() => {
    if (!fioCryptoHandleName || getMappedPubAddressError === NOT_FOUND) {
      dispatch(resetMappedPubAddressError());
      setTimeout(() => {
        history.push(ROUTES.FIO_ADDRESSES);
      }, REDIRECT_TIMEOUT);
    }
  }, [dispatch, fioCryptoHandleName, getMappedPubAddressError, history]);
};
