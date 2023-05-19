import React from 'react';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

import classes from './ExclamationIcon.module.scss';

export const ExclamationIcon: React.FC = () => {
  return (
    <div className={classes.container}>
      <NewReleasesIcon />
    </div>
  );
};
