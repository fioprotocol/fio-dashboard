import React from 'react';
import classnames from 'classnames';
import CircularProgress from '@mui/material/CircularProgress';

import classes from './Loader.module.scss';

type Props = {
  hasAutoWidth?: boolean;
  hasInheritFontSize?: boolean;
  isWhite?: boolean;
};

const Loader: React.FC<Props> = props => {
  const { hasAutoWidth, hasInheritFontSize, isWhite } = props;

  return (
    <div
      className={classnames(
        classes.loader,
        hasAutoWidth && classes.hasAutoWidth,
        hasInheritFontSize && classes.hasInheritFontSize,
        isWhite && classes.isWhite,
      )}
    >
      <CircularProgress />
    </div>
  );
};

export default Loader;
