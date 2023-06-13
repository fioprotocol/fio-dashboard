import React from 'react';

import {
  FioProfileActionBadge,
  ACTION_BUTTONS_NAMES,
} from '../../../../../components/FioProfileActionBadge';
import { FindFioHandleForm } from '../FindFioHandleForm';

import FioHandleImageSrc from '../../../../../assets/images/fio-handle-image.png';

import classes from './FindFioHandle.module.scss';

type Props = {
  fioBaseUrl: string;
};

export const FindFioHandleSection: React.FC<Props> = props => {
  const { fioBaseUrl } = props;

  return (
    <div className={classes.container}>
      <FioProfileActionBadge
        fioBaseUrl={fioBaseUrl}
        actionButtons={[
          ACTION_BUTTONS_NAMES.GET_FIO_HANDLE,
          ACTION_BUTTONS_NAMES.MANAGE_FIO_HANDLE,
        ]}
      />
      <div className={classes.contentContainer}>
        <FindFioHandleForm fioBaseUrl={fioBaseUrl} />
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
