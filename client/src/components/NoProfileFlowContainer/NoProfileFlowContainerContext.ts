import { useSelector } from 'react-redux';

import {
  refProfileInfo,
  loading as loadingSelector,
} from '../../redux/refProfile/selectors';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import useQuery from '../../hooks/useQuery';
import useEffectOnce from '../../hooks/general';
import { setCookies } from '../../util/cookies';

import { RefProfile } from '../../types';

type UseContextProps = {
  publicKey: string | null;
  refProfile: RefProfile;
  loading: boolean;
};

export const useContext = (): UseContextProps => {
  const refProfile = useSelector(refProfileInfo);
  const loading = useSelector(loadingSelector);

  const queryParams = useQuery();

  const publicKey = queryParams.get(QUERY_PARAMS_NAMES.PUBLIC_KEY) || null;

  useEffectOnce(
    () => {
      setCookies(QUERY_PARAMS_NAMES.PUBLIC_KEY, publicKey, null);
    },
    [],
    !!publicKey,
  );

  return { refProfile, publicKey, loading };
};
