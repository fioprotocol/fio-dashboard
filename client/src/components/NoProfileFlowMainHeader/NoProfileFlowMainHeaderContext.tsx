import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

import { refProfileInfo } from '../../redux/refProfile/selectors';
import { pathname as pathnameSelector } from '../../redux/navigation/selectors';

import useQuery from '../../hooks/useQuery';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import { RefProfile } from '../../types';

type UseContextProps = {
  activeEventKey: string;
  publicKey?: string;
  refProfile: RefProfile;
  handleEventKeySelect: (activeKey: string) => void;
};

export const useContext = (): UseContextProps => {
  const refProfile = useSelector(refProfileInfo);
  const queryParams = useQuery();
  const pathname = useSelector(pathnameSelector);

  const [activeEventKey, setActiveEventKey] = useState<string>(pathname);

  const handleEventKeySelect = useCallback((eventKey: string) => {
    setActiveEventKey(eventKey);
  }, []);

  const publicKeyQueryParam = queryParams.get(QUERY_PARAMS_NAMES.PUBLIC_KEY);
  const publicKeyCookie = Cookies.get(QUERY_PARAMS_NAMES.PUBLIC_KEY);

  const publicKey = publicKeyQueryParam || publicKeyCookie;

  return {
    activeEventKey,
    publicKey,
    refProfile,
    handleEventKeySelect,
  };
};
