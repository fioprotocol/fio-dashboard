import React, { MouseEvent, useCallback, useRef } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import classnames from 'classnames';

import { copyToClipboard } from '../../../util/general';

import classes from '../FioTokensReceive.module.scss';

type Props = {
  value: string;
  disabled?: boolean;
};

export const DataValue: React.FC<Props> = ({ value, disabled = false }) => {
  const valueRef = useRef<HTMLDivElement | null>(null);

  const onCopy = useCallback(() => {
    !disabled && copyToClipboard(value);
  }, [value, disabled]);

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
    <div
      className={classes.value}
      onClick={disabled ? () => null : onClick}
      ref={valueRef}
    >
      {value}
      <ContentCopyIcon
        className={classnames(classes.icon, disabled && classes.disabled)}
        onClick={onCopy}
      />
    </div>
  );
};
