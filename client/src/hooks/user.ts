import { useSelector } from 'react-redux';

import { user as userSelector } from '../redux/profile/selectors';
import { USER_PROFILE_TYPE } from '../constants/profile';

import { isMetaMask } from '../util/ethereum';

export const useIsMetaMaskUser = () => {
  const user = useSelector(userSelector);

  return (
    isMetaMask() && user?.userProfileType === USER_PROFILE_TYPE.ALTERNATIVE
  );
};
