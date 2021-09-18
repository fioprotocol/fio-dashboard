import React from 'react';

import classes from './CancelButton.module.scss';

type Props = {
  onClick: () => void;
};

const CancelButton: React.FC<Props> = props => {
  const { onClick } = props;
  return (
    <button className={classes.button} onClick={onClick}>
      Cancel
    </button>
  );
};

export default CancelButton;
