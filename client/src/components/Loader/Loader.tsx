import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

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
      <FontAwesomeIcon icon="spinner" spin />
    </div>
  );
};

export default Loader;
