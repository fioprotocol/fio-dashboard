import { fioApi } from '../external/fio.mjs';

import logger from '../logger.mjs';

export const getDetailedUsersInfo = async user => {
  const userObj = user.json();

  const fioWallets = [];
  const fioAddresses = [];
  const fioDomains = [];

  if (user.fioWallets && user.fioWallets.length > 0) {
    for (const fioWallet of user.fioWallets) {
      const { publicKey, name } = fioWallet;

      const fioWalletObj = { publicKey, name };

      try {
        const balanceResponse = await fioApi.getPublicFioSDK().getFioBalance(publicKey);
        fioWalletObj.balance = await fioApi
          .sufToAmount(balanceResponse.balance)
          .toFixed(2);

        fioWallets.push(fioWalletObj);
      } catch (err) {
        logger.error(err);
      }

      try {
        const { fio_addresses, fio_domains } = await fioApi
          .getPublicFioSDK()
          .getFioNames(publicKey);

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
