import React from 'react';
import classnames from 'classnames';

import classes from './CancelButton.module.scss';

type Props = {
  onClick: () => void;
  disabled?: boolean;
  isThin?: boolean;
};

const CancelButton: React.FC<Props> = props => {
  const { onClick, disabled, isThin } = props;
  return (
    <button
      className={classnames(classes.button, isThin && classes.thin)}
      onClick={onClick}
      disabled={disabled}
    >
      Cancel
    </button>
  );
};

export default CancelButton;
