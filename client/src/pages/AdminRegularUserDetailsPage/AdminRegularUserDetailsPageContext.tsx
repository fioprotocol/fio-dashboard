import { useCallback, useState } from 'react';
import { useHistory } from 'react-router';

import useQuery from '../../hooks/useQuery';
import useEffectOnce from '../../hooks/general';

import apis from '../../api';
import { handleUserProfileType } from '../../util/user';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { ROUTES } from '../../constants/routes';

import { OrderDetails, UserDetails } from '../../types';

type Props = {
  loading: boolean;
  handleOrderClick: (id: string) => void;
  handleOrderClose: () => void;
  orderInfo: OrderDetails;
} & UserDetails;

export const useContext = (): Props => {
  const history = useHistory<{ userEmail: string }>();
  const queryParams = useQuery();

  const userId = queryParams.get(QUERY_PARAMS_NAMES.USER_ID);

  const [loading, setLoading] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetails>(null);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [orderItem, setOrderItem] = useState<OrderDetails | null>(null);

  const getUserDetails = useCallback(async () => {
    if (!userId) history.push(ROUTES.ADMIN_REGULAR_USERS);

    setLoading(true);

    const userDetailsData = await apis.admin.userDetails(userId);

    if (userDetailsData) {
      const userProfileType = handleUserProfileType({
        userProfileType: userDetailsData.userProfileType,
        fioWallets: userDetailsData.fioWallets,
      });
      setUserDetails({ ...userDetailsData, userProfileType });
    }

    setLoading(false);
  }, [history, userId]);

  const handleOrderClick = useCallback(async (orderId: string) => {
    const orderItem = await apis.admin.order(orderId);
    setOrderItem(orderItem);
    setShowOrderDetailsModal(true);
  }, []);

  const handleOrderClose = useCallback(() => {
    setOrderItem(null);
    setShowOrderDetailsModal(false);
  }, []);

  useEffectOnce(() => {
    getUserDetails();
  }, [getUserDetails]);

  return {
    loading,
    ...userDetails,
    handleOrderClick,
    handleOrderClose,
    orderInfo: showOrderDetailsModal && !!orderItem ? orderItem : null,
  };
};
