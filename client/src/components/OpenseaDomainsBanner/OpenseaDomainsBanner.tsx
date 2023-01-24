import React, { useCallback } from 'react';

import classes from './OpenseaDomainsBanner.module.scss';

import openseaLogo from '../../assets/images/opensea-logo-dark.svg';
import monsterMan from '../../assets/images/monster-man.svg';

export const OpenseaDomainsBanner: React.FC = () => {
  const goToCollection = useCallback(() => {
    window.open('https://opensea.io/collection/fio-domains', '_self');
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper} onClick={goToCollection}>
        <div className={classes.content}>
          <div className={classes.title}>Now available for sale on</div>

          <div className={classes.logoContainer}>
            <img
              alt="OpenSea"
              src={monsterMan}
              className={classes.monsterImage}
            />
            <img alt="OpenSea" src={openseaLogo} className={classes.logo} />
          </div>
        </div>
      </div>
    </div>
  );
};
