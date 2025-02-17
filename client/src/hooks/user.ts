import { useSelector } from 'react-redux';

import { user as userSelector } from '../redux/profile/selectors';
import { USER_PROFILE_TYPE } from '../constants/profile';

import { useMetaMaskProvider } from './useMetaMaskProvider';

export const useIsMetaMaskUser = () => {
  const user = useSelector(userSelector);
  const metaMaskProvider = useMetaMaskProvider();

  return (
    !!metaMaskProvider &&
    user?.userProfileType === USER_PROFILE_TYPE.ALTERNATIVE
  );
};
