import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  refProfileInfo,
  loading as loadingSelector,
} from '../../redux/refProfile/selectors';

import { getInfo } from '../../redux/refProfile/actions';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import useQuery from '../../hooks/useQuery';

import { RefProfile } from '../../types';

type UseContextProps = {
  publicKey: string | null;
  refProfile: RefProfile;
};

export const useContext = (): UseContextProps => {
  const refProfile = useSelector(refProfileInfo);
  const loading = useSelector(loadingSelector);

  const queryParams = useQuery();

  const dispatch = useDispatch();

  const publicKey = queryParams.get(QUERY_PARAMS_NAMES.PUBLIC_KEY) || null;

  const getRefcodeFromUrl = () => {
    const regex = /\/(?:address|ref|domain)(?:\/renew)?\/([^\/]+)/;
    const match = regex.exec(window.location.pathname);
    return match ? match[1] : null;
  };

  const refCode = getRefcodeFromUrl();

  useEffect(() => {
    if (!loading && refCode && (!refProfile || refProfile?.code !== refCode)) {
      dispatch(getInfo(refCode));
    }
  }, [loading, refProfile, refCode, dispatch]);

  return { refProfile, publicKey };
};
