import React from 'react';
import classnames from 'classnames';

import classes from './CloseButton.module.scss';

type Props = {
  handleClick?: () => void;
  isWhite?: boolean;
  className?: string;
};

const CloseButton: React.FC<Props> = props => {
  const { handleClick, isWhite = false, className } = props;
  return (
    <div
      className={classnames(
        classes.closeButton,
        isWhite && classes.white,
        className,
      )}
      onClick={handleClick}
    />
  );
};

export default CloseButton;
