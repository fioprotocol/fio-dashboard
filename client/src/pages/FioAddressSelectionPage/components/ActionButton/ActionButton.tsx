import React from 'react';

import { Button } from 'react-bootstrap';
import AddBox from '@mui/icons-material/AddBox';
import classnames from 'classnames';

import classes from './ActionButton.module.scss';

type Props = {
  hasSquareShape?: boolean;
  text: string;
};

export const ActionButton: React.FC<Props> = props => {
  const { hasSquareShape, text } = props;

  return (
    <Button
      // TODO: set onclick
      // onClick={onClick}
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
