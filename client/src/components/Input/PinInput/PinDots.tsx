import React from 'react';
import classnames from 'classnames';

import classes from '../styles/PinInput.module.scss';
import { PIN_LENGTH } from '../../../constants/form';

type Props = {
  error: boolean;
  value?: string;
};

const PinDots: React.FC<Props> = props => {
  const { value, error } = props;
  const positionNumber = (value && value.length) || 0;

  const renderDots = () => {
    const dots = [];
    for (let i = 1; i < PIN_LENGTH + 1; i++) {
      dots.push(
        <div
          key={i}
          className={classnames(
            classes.dotEmpty,
            i <= positionNumber && classes.dotFull,
            error && classes.dotError,
          )}
        />,
      );
    }
    return dots;
  };

  return <div className={classes.dotsContainer}>{renderDots()}</div>;
};

export default PinDots;
