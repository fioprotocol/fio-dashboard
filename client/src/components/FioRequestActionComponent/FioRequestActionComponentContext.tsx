import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import { fioWalletsData as fioWalletsDataSelector } from '../../redux/fioWalletsData/selectors';
import { user as userSelector } from '../../redux/profile/selectors';

import { FIO_REQUEST_STATUS_TYPES } from '../../constants/fio';

type UseContextProps = {
  fioPublicKeyHasRequest: string | undefined;
};

export const useContext = (): UseContextProps => {
  const fioWalletsData = useSelector(fioWalletsDataSelector);
  const user = useSelector(userSelector);

  const fioPublicKeyHasRequest =
    !isEmpty(fioWalletsData) &&
    user?.id &&
    fioWalletsData[user.id] &&
    Object.keys(fioWalletsData[user.id]).find(fioWalletKey => {
      const fioRequests =
        fioWalletsData[user.id][fioWalletKey].receivedFioRequests || [];
      return (
        fioRequests.length > 0 &&
        fioRequests.some(
          fioRequest => fioRequest.status === FIO_REQUEST_STATUS_TYPES.PENDING,
        )
      );
    });

  return {
    fioPublicKeyHasRequest,
  };
};
