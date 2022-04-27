import React, { useEffect, useState } from 'react';

import FioLoader from '../common/FioLoader/FioLoader';

import { Props } from './types';

const FioNamesInitWrapper: React.FC<Props> = props => {
  const {
    children,
    profileRefreshed,
    fioAddresses,
    fioDomains,
    fioWallets,
    refreshFioNames,
    fioNamesInitRefreshed,
  } = props;

  const [initFetched, setInitFetched] = useState<boolean>(false);
  const [initRefreshed, setInitRefreshed] = useState<boolean>(false);

  useEffect(() => {
    if (
      profileRefreshed &&
      !initFetched &&
      fioWallets.length &&
      !!refreshFioNames
    ) {
      if (!fioAddresses.length || !fioDomains.length) {
        for (const fioWallet of fioWallets) {
          !!fioWallet.publicKey && refreshFioNames(fioWallet.publicKey);
        }
      }
      setInitFetched(true);
    }
  }, [
    profileRefreshed,
    initFetched,
    fioWallets,
    fioAddresses,
    fioDomains,
    refreshFioNames,
  ]);

  useEffect(() => {
    if (
      profileRefreshed &&
      initFetched &&
      !initRefreshed &&
      fioWallets.length
    ) {
      let allRefreshed = true;
      for (const fioWallet of fioWallets) {
        if (!fioNamesInitRefreshed[fioWallet.publicKey]) allRefreshed = false;
      }
      allRefreshed && setInitRefreshed(true);
    }
  }, [
    profileRefreshed,
    initFetched,
    initRefreshed,
    fioWallets,
    fioNamesInitRefreshed,
  ]);

  if (!profileRefreshed || !initFetched || !initRefreshed)
    return <FioLoader wrap={true} />;

  return children;
};

export default FioNamesInitWrapper;
