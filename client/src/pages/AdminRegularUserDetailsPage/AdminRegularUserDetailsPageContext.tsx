import { useCallback, useState } from 'react';
import { useHistory } from 'react-router';

import useQuery from '../../hooks/useQuery';
import useEffectOnce from '../../hooks/general';

import apis from '../../api';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { ROUTES } from '../../constants/routes';

import { UserDetails } from '../../types';

type Props = {
  loading: boolean;
} & UserDetails;

export const useContext = (): Props => {
  const history = useHistory<{ userEmail: string }>();
  const queryParams = useQuery();

  const userId = queryParams.get(QUERY_PARAMS_NAMES.USER_ID);

  const [loading, setLoading] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetails>(null);

  const getUserDetails = useCallback(async () => {
    if (!userId) history.push(ROUTES.ADMIN_REGULAR_USERS);

    setLoading(true);

    const userDetailsData = await apis.admin.userDetails(userId);

    if (userDetailsData) {
      setUserDetails(userDetailsData);
    }

    setLoading(false);
  }, [history, userId]);

  useEffectOnce(() => {
    getUserDetails();
  }, [getUserDetails]);

  return {
    loading,
    ...userDetails,
  };
};
