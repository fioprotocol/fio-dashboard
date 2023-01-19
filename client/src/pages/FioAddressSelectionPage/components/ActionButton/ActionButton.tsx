import React from 'react';

import { Button } from 'react-bootstrap';
import AddBox from '@mui/icons-material/AddBox';
import classnames from 'classnames';

import classes from './ActionButton.module.scss';

type Props = {
  hasSquareShape?: boolean;
  text: string;
  onClick: () => void;
};

export const ActionButton: React.FC<Props> = props => {
  const { hasSquareShape, text, onClick } = props;

  return (
    <Button
      onClick={onClick}
      className={classnames(
        classes.button,
        hasSquareShape && classes.hasSquareShape,
      )}
    >
      <AddBox className={classes.icon} />
      <p className={classes.text}>{text}</p>
    </Button>
  );
};
