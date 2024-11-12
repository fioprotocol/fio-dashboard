import { useSelector } from 'react-redux';

import { user as userSelector } from '../redux/profile/selectors';
import { USER_PROFILE_TYPE } from '../constants/profile';

export const useIsMetaMaskUser = () => {
  const user = useSelector(userSelector);

  return (
    window.ethereum?.isMetaMask &&
    user?.userProfileType === USER_PROFILE_TYPE.ALTERNATIVE
  );
};
