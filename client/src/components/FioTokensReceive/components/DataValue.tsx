import React, { MouseEvent, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { copyToClipboard } from '../../../util/general';

import classes from '../FioTokensReceive.module.scss';

type Props = {
  value: string;
};

export const DataValue: React.FC<Props> = ({ value }) => {
  const valueRef = useRef<HTMLDivElement | null>(null);

  const onCopy = useCallback(() => {
    copyToClipboard(value);
  }, [value]);

  const onClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.detail === 2) {
      const range = document.createRange();
      range.selectNodeContents(valueRef.current);

      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, []);

  return (
    <div className={classes.value} onClick={onClick} ref={valueRef}>
      {value}
      <FontAwesomeIcon
        className={classes.icon}
        icon={{ prefix: 'far', iconName: 'copy' }}
        onClick={onCopy}
      />
    </div>
  );
};
