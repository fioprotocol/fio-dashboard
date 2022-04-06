import React, { useEffect, useState } from 'react';

import FioLoader from '../common/FioLoader/FioLoader';

import { Props } from './types';

const FioNamesInitWrapper: React.FC<Props> = (props: Props) => {
  const {
    children,
    profileRefreshed,
    fioAddresses,
    fioDomains,
    fioWallets,
    refreshFioNames,
  } = props;

  const [initFetched, setInitFetched] = useState<boolean>(false);

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

  if (!profileRefreshed || !initFetched) return <FioLoader wrap={true} />;

  return children;
};

export default FioNamesInitWrapper;
