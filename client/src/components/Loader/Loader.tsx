import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from './Loader.module.scss';

const Loader: React.FC = () => {
  return (
    <div className={classes.loader}>
      <FontAwesomeIcon icon="spinner" spin />
    </div>
  );
};

export default Loader;
