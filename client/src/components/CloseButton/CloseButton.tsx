import React from 'react';
import classnames from 'classnames';

import classes from './CloseButton.module.scss';

type Props = {
  handleClick?: () => void;
  isWhite?: boolean;
};

const CloseButton: React.FC<Props> = props => {
  const { handleClick, isWhite = false } = props;
  return (
    <div
      className={classnames(classes.closeButton, isWhite && classes.white)}
      onClick={handleClick}
    />
  );
};

export default CloseButton;
