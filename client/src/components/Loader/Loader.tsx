import React from 'react';
import classnames from 'classnames';
import CircularProgress from '@mui/material/CircularProgress';

import classes from './Loader.module.scss';

type Props = {
  hasAutoWidth?: boolean;
  hasInheritFontSize?: boolean;
  hasSmallSize?: boolean;
  isWhite?: boolean;
};

const Loader: React.FC<Props> = props => {
  const { hasAutoWidth, hasInheritFontSize, hasSmallSize, isWhite } = props;

  return (
    <div
      className={classnames(
        classes.loader,
        hasAutoWidth && classes.hasAutoWidth,
        hasInheritFontSize && classes.hasInheritFontSize,
        hasSmallSize && classes.hasSmallSize,
        isWhite && classes.isWhite,
      )}
    >
      <CircularProgress />
    </div>
  );
};

export default Loader;
