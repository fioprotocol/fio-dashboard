import React from 'react';

import { FioProfileActionBadge } from '../../../../../components/FioProfileActionBadge';
import { FindFioHandleForm } from '../FindFioHandleForm';

import FioHandleImageSrc from '../../../../../assets/images/fio-handle-image.png';

import classes from './FindFioHandle.module.scss';

export const FindFioHandleSection: React.FC = () => {
  return (
    <div className={classes.container}>
      <FioProfileActionBadge />
      <div className={classes.contentContainer}>
        <FindFioHandleForm />
        <div className={classes.imageContainer}>
          <img
            src={FioHandleImageSrc}
            alt="FIOHandleImage"
            className={classes.image}
          />
        </div>
      </div>
    </div>
  );
};
