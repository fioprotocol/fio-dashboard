import { fioApi } from '../external/fio.mjs';

import logger from '../logger.mjs';
import { Notification, ReferrerProfile, User, Wallet } from '../models/index.mjs';
import { WALLET_CREATED_FROM, ERROR_CODES } from '../config/constants.js';
import config from '../config/index.mjs';

const DEFAULT_CHUNK_LIMIT = 100;

const chunkArray = (array, size) => {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
};

export const getDetailedUsersInfo = async user => {
  const fioWallets = [];
  const fioAddresses = [];
  const fioDomains = [];

  const processFioWallets = async fioWalletsChunk => {
    const publicFioSDK = await fioApi.getPublicFioSDK();

    const results = await Promise.allSettled(
      fioWalletsChunk.map(async fioWallet => {
        const { publicKey, name, failedSyncedWithEdge, from } = fioWallet;
        const fioWalletObj = { publicKey, name, failedSyncedWithEdge, from };
        fioWalletObj.balance = 'N/A';

        try {
          const balanceResponse = await publicFioSDK.getFioBalance({
            fioPublicKey: publicKey,
          });
          fioWalletObj.balance = fioApi.sufToAmount(balanceResponse.balance);
        } catch (err) {
          // getFioBalance returns a 404 error if user doesn't have any transactions on a wallet
          if (
            err.errorCode === ERROR_CODES.NOT_FOUND ||
            err.code === ERROR_CODES.NOT_FOUND
          ) {
            fioWalletObj.balance = '0.00';
          } else {
            logger.error(err);
          }
        }

        try {
          const { fio_addresses, fio_domains } = await publicFioSDK.getFioNames({
            fioPublicKey: publicKey,
          });

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

        return fioWalletObj;
      }),
    );

    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
  };

  if (user.fioWallets && user.fioWallets.length > 0) {
    const chunks = chunkArray(user.fioWallets, DEFAULT_CHUNK_LIMIT);

    for (const chunk of chunks) {
      const processedChunk = await processFioWallets(chunk);
      fioWallets.push(...processedChunk);
    }
  }

  user.fioWallets = fioWallets;
  user.fioAddresses = fioAddresses;
  user.fioDomains = fioDomains;

  return user;
};

export const getExistUsersByPublicKeyOrCreateNew = async (
  publicKey,
  refCode = '',
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
    freeId: publicKey,
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

export function emailToUsername(email) {
  if (email && email.indexOf('@') > 0) {
    const [name, domain] = email.toLowerCase().split('@');
    // return name
    return `${name}${config.user.fioDashUsernameDelimiter}${domain}`;
  }

  return '';
}
