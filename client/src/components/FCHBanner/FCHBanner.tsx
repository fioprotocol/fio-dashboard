import React from 'react';

import classes from './FCHBanner.module.scss';

type Props = {
  fch: string;
};

export const FCHBanner: React.FC<Props> = ({ fch }) => {
  return (
    <div className={classes.container}>
      <div className={classes.center}>
        <div className={classes.row}>
          <div className={classes.text}>
            Now people will be able to send crypto to
          </div>
          <div className={classes.fchWrapper}>
            <div className={classes.fch}>{fch}</div>
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
    </div>
  );
};
