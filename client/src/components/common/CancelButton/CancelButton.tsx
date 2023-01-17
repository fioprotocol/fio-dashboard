import React from 'react';
import classnames from 'classnames';

import classes from './CancelButton.module.scss';

type Props = {
  onClick: () => void;
  disabled?: boolean;
  isBlack?: boolean;
  isIndigo?: boolean;
  withTopMargin?: boolean;
  withBottomMargin?: boolean;
  isThin?: boolean;
  text?: string;
};

const CancelButton: React.FC<Props> = props => {
  const {
    onClick,
    disabled,
    isBlack,
    isIndigo,
    withTopMargin,
    withBottomMargin,
    isThin,
    text,
  } = props;

  return (
    <button
      className={classnames(
        classes.button,
        isThin && classes.thin,
        isBlack && classes.black,
        isIndigo && classes.indigo,
        withTopMargin && classes.topMargin,
        withBottomMargin && classes.bottomMargin,
      )}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {text || 'Cancel'}
    </button>
  );
};

export default CancelButton;
