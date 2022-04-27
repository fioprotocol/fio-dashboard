import React, { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import { NUMERIC_KEYBOARD_LIST, BACKSPACE, PLUG } from './constants';

import classes from '../styles/NumericKeyboard.module.scss';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

type NumericItemProps = {
  numKey: string;
  onChange: (value: string) => void;
};

const NumericItem: React.FC<NumericItemProps> = props => {
  const { numKey, onChange } = props;

  const tap = useCallback(() => onChange(numKey), [numKey, onChange]);

  return (
    <div
      className={classnames(classes.numKey, numKey === PLUG && classes.hide)}
      onClick={tap}
    >
      {numKey === BACKSPACE ? <FontAwesomeIcon icon="backspace" /> : numKey}
    </div>
  );
};

const NumericKeyboard: React.FC<Props> = props => {
  const { onChange } = props;

  return (
    <div className={classes.container}>
      {NUMERIC_KEYBOARD_LIST.map((numKey: string) => (
        <NumericItem numKey={numKey} onChange={onChange} key={numKey} />
      ))}
    </div>
  );
};

export default NumericKeyboard;
