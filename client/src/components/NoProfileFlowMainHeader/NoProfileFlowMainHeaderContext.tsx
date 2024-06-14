import { useState } from 'react';
import { useSelector } from 'react-redux';

import { refProfileInfo } from '../../redux/refProfile/selectors';

import useQuery from '../../hooks/useQuery';

import { RefProfile } from '../../types';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

type UseContextProps = {
  activeEventKey: number;
  publicKeyQueryParam?: string;
  refProfile: RefProfile;
  setActiveEventKey: (activeKey: number) => void;
};

export const useContext = (): UseContextProps => {
  const refProfile = useSelector(refProfileInfo);
  const queryParams = useQuery();

  const [activeEventKey, setActiveEventKey] = useState(0);

  const publicKeyQueryParam = queryParams.get(QUERY_PARAMS_NAMES.PUBLIC_KEY);

  return { activeEventKey, publicKeyQueryParam, refProfile, setActiveEventKey };
};
