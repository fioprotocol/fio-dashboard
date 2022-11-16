import React from 'react';

import FioLoader from '../../../../components/common/FioLoader/FioLoader';

import classes from './Loader.module.scss';

type Props = {};

export const Loader: React.FC<Props> = props => {
  return (
    <div className={classes.loader}>
      <FioLoader wrap />
    </div>
  );
};
