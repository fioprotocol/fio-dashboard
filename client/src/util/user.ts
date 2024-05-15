import { WALLET_CREATED_FROM } from '../constants/common';
import { USER_PROFILE_TYPE } from '../constants/profile';
import { FioWalletDoublet } from '../types';

export const handleUserProfileType = ({
  userProfileType,
  fioWallets,
}: {
  userProfileType: string;
  fioWallets: FioWalletDoublet[];
}): string => {
  let type = null;

  if (userProfileType === USER_PROFILE_TYPE.PRIMARY) {
    type = 'EDGE';
  }
  if (userProfileType === USER_PROFILE_TYPE.ALTERNATIVE) {
    if (
      fioWallets &&
      fioWallets.some(
        fioWallet => fioWallet.from === WALLET_CREATED_FROM.METAMASK,
      )
    ) {
      type = 'MetaMask';
    }
  }
  return type;
};
