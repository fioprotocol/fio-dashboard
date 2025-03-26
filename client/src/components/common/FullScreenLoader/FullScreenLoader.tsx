import React from 'react';

import FioLoader from '../FioLoader/FioLoader';

import classes from './FullScreenLoader.module.scss';

const FullScreenLoader: React.FC = () => {
  return (
    <div className={classes.container}>
      <FioLoader wrapCenter />
    </div>
  );
};

export default FullScreenLoader;
