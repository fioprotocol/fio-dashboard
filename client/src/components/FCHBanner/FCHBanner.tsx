import React from 'react';

import classes from './FCHBanner.module.scss';

export const FCHBanner: React.FC = () => {
  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <div className={classes.text}>
          Now people will be able to send crypto to
        </div>
        <div className={classes.fchWrapper}>
          <div className={classes.fch}>bob@rulez</div>
        </div>
      </div>
      <div className={classes.row}>
        <div className={classes.text}>instead of</div>
        <div className={classes.publicKeyWrapper}>
          <div className={classes.publicKey}>
            bc1qxy2kgdygjrsqtzq2n0yrf3293p93kkfjhx0wlh
          </div>
        </div>
      </div>
    </div>
  );
};
