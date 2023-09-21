import React from 'react';
import classnames from 'classnames';
import CircularProgress from '@mui/material/CircularProgress';

import classes from './Loader.module.scss';

type Props = {
  className?: string;
  hasAutoWidth?: boolean;
  hasInheritFontSize?: boolean;
  hasSmallSize?: boolean;
  isWhite?: boolean;
  styles?: { [key: string]: string };
};

const Loader: React.FC<Props> = props => {
  const {
    className,
    hasAutoWidth,
    hasInheritFontSize,
    hasSmallSize,
    isWhite,
    styles,
  } = props;

  return (
    <div
      className={classnames(
        classes.loader,
        hasAutoWidth && classes.hasAutoWidth,
        hasInheritFontSize && classes.hasInheritFontSize,
        hasSmallSize && classes.hasSmallSize,
        isWhite && classes.isWhite,
        className,
      )}
    >
      <CircularProgress style={styles} />
    </div>
  );
};

export default Loader;
