import React, { useCallback } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CopyTooltip from '../../../../CopyTooltip';

import { copyToClipboard } from '../../../../../util/general';

import classes from './CommandComponent.module.scss';

type Props = {
  commandString: string;
  show: boolean;
};

export const CommandComponent: React.FC<Props> = props => {
  const { commandString, show } = props;

  const onClick = useCallback(() => {
    copyToClipboard(commandString);
  }, [commandString]);

  if (!show) return null;

  return (
    <div className={classes.commandContainer}>
      <p className="mb-0">{commandString}</p>
      <div className={classes.copyButton}>
        <CopyTooltip>
          <FontAwesomeIcon
            className={classes.icon}
            icon={{ prefix: 'far', iconName: 'copy' }}
            onClick={onClick}
          />
        </CopyTooltip>
      </div>
    </div>
  );
};
