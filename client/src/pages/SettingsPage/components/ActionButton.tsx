import React from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import classes from '../styles/ActionButton.module.scss';

type Props = {
  onClick: () => void;
  title: string;
  isGreen?: boolean;
  isBlue?: boolean;
  isSmall?: boolean;
};

const ActionButton: React.FC<Props> = props => {
  const { onClick, title, isGreen, isBlue, isSmall } = props;
  return (
    <Button
      onClick={onClick}
      className={classnames(
        classes.button,
        isGreen && classes.isGreen,
        isBlue && classes.isBlue,
        isSmall && classes.isSmall,
      )}
    >
      {title}
    </Button>
  );
};

export default ActionButton;
