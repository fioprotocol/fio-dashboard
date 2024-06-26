import { fioApi } from '../external/fio.mjs';

import logger from '../logger.mjs';
import { Notification, ReferrerProfile, User, Wallet } from '../models/index.mjs';
import { WALLET_CREATED_FROM } from '../config/constants.js';

export const getDetailedUsersInfo = async user => {
  const userObj = user.json();

  const fioWallets = [];
  const fioAddresses = [];
  const fioDomains = [];

  if (user.fioWallets && user.fioWallets.length > 0) {
    for (const fioWallet of user.fioWallets) {
      const { publicKey, name, failedSyncedWithEdge, from } = fioWallet;

      const fioWalletObj = { publicKey, name, failedSyncedWithEdge, from };
      fioWalletObj.balance = 'N/A';

      const publicFioSDK = await fioApi.getPublicFioSDK();
      try {
        const balanceResponse = await publicFioSDK.getFioBalance(publicKey);
        fioWalletObj.balance = await fioApi
          .sufToAmount(balanceResponse.balance)
          .toFixed(2);
      } catch (err) {
        // getFioBalance returns a 404 error if user doesn't have any transactions on a wallet
        if (err.errorCode === 404) fioWalletObj.balance = '0.00';
        logger.error(err);
      }

      fioWallets.push(fioWalletObj);

      try {
        const { fio_addresses, fio_domains } = await publicFioSDK.getFioNames(publicKey);

        if (fio_addresses.length > 0) {
          fio_addresses.forEach(fio_address => {
            fioAddresses.push({
              remaining: fio_address.remaining_bundled_tx,
              name: fio_address.fio_address,
              walletName: name,
            });
          });
        }
        if (fio_domains.length > 0) {
          fio_domains.forEach(fio_domain => {
            fioDomains.push({
              expiration: fio_domain.expiration,
              isPublic: fio_domain.is_public,
              name: fio_domain.fio_domain,
              walletName: name,
            });
          });
        }
      } catch (err) {
        logger.error(err);
      }
    }
  }

  userObj.fioWallets = fioWallets;
  userObj.fioAddresses = fioAddresses;
  userObj.fioDomains = fioDomains;

  return userObj;
};

export const getExistUsersByPublicKeyOrCreateNew = async (
  publicKey,
  refCode,
  timeZone,
) => {
  const existingWallets = await Wallet.list({
    publicKey,
  });

  if (existingWallets && existingWallets.length > 0) {
    const users = [];

    for (const existingWalletItem of existingWallets) {
      const user = await User.info(existingWalletItem.userId);
      users.push(user.json());
    }

    return users;
  }

  const refProfile = await ReferrerProfile.findOneWhere({
    code: refCode,
  });

  const refProfileId = refProfile ? refProfile.id : null;

  const user = new User({
    status: User.STATUS.ACTIVE,
    refProfileId,
    isOptIn: false,
    timeZone,
    userProfileType: User.USER_PROFILE_TYPE.WITHOUT_REGISTRATION,
  });

  await user.save();

  await new Notification({
    type: Notification.TYPE.INFO,
    contentType: Notification.CONTENT_TYPE.ACCOUNT_CREATE,
    userId: user.id,
    data: { pagesToShow: ['/myfio'] },
  }).save();

  const newWallet = new Wallet({
    name: 'My FIO wallet',
    from: WALLET_CREATED_FROM.WITHOUT_REGISTRATION,
    publicKey,
    userId: user.id,
  });

  await newWallet.save();

  return [user.json()];
};
