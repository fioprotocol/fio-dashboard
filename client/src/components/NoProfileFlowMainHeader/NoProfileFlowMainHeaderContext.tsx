import { useState } from 'react';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

import { refProfileInfo } from '../../redux/refProfile/selectors';

import useQuery from '../../hooks/useQuery';

import { RefProfile } from '../../types';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

type UseContextProps = {
  activeEventKey: number;
  publicKey?: string;
  refProfile: RefProfile;
  setActiveEventKey: (activeKey: number) => void;
};

export const useContext = (): UseContextProps => {
  const refProfile = useSelector(refProfileInfo);
  const queryParams = useQuery();

  const [activeEventKey, setActiveEventKey] = useState(0);

  const publicKeyQueryParam = queryParams.get(QUERY_PARAMS_NAMES.PUBLIC_KEY);
  const publicKeyCookie = Cookies.get(QUERY_PARAMS_NAMES.PUBLIC_KEY);

  const publicKey = publicKeyQueryParam || publicKeyCookie;

  return { activeEventKey, publicKey, refProfile, setActiveEventKey };
};
