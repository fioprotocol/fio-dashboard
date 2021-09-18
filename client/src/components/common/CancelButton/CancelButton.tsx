import React from 'react';

import classes from './CancelButton.module.scss';

type Props = {
  onClick: () => void;
  disabled?: boolean;
};

const CancelButton: React.FC<Props> = props => {
  const { onClick, disabled } = props;
  return (
    <button className={classes.button} onClick={onClick} disabled={disabled}>
      Cancel
    </button>
  );
};

export default CancelButton;
