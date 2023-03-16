import { useSelector } from 'react-redux';

import { fioWalletsData as fioWalletsDataSelector } from '../../redux/fioWalletsData/selectors';
import { user as userSelector } from '../../redux/profile/selectors';

type UseContextProps = {
  fioPublicKeyHasRequest: string | undefined;
};

export const useContext = (): UseContextProps => {
  const fioWalletsData = useSelector(fioWalletsDataSelector);
  const user = useSelector(userSelector);

  const fioPublicKeyHasRequest = Object.keys(fioWalletsData[user?.id]).find(
    fioWalletKey =>
      fioWalletsData[user?.id][fioWalletKey].receivedFioRequests?.length > 0,
  );

  return {
    fioPublicKeyHasRequest,
  };
};
