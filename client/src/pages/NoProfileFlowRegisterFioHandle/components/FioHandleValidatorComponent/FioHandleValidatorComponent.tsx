import React from 'react';
import classnames from 'classnames';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

import { FadeLoader } from 'react-spinners';

import classes from './FioHandleValidatorComponent.module.scss';

type Props = {
  loaderText?: string;
  hasFioVerificationError: boolean;
  infoMessage: string;
  isVerifying: boolean;
  isFioHandleVerified: boolean;
};

export const FioHandleValidatorComponent: React.FC<Props> = props => {
  const {
    hasFioVerificationError,
    isFioHandleVerified,
    isVerifying,
    infoMessage,
    loaderText = 'Verifying availability',
  } = props;

  return (
    <div className={classes.container}>
      {isVerifying && (
        <div className={classes.loader}>
          <FadeLoader
            height="8px"
            width="4px"
            radius="3px"
            margin="1px"
            color="rgb(118, 92, 214)"
          />
          <p className={classes.loaderText}>{loaderText}</p>
        </div>
      )}
      <div
        className={classnames(
          classes.infoBadge,
          hasFioVerificationError && classes.hasVerifiedError,
          isFioHandleVerified && classes.isVerified,
          hasFioVerificationError && classes.hasVerificationError,
        )}
      >
        {isFioHandleVerified && !hasFioVerificationError ? (
          <CheckCircleIcon />
        ) : hasFioVerificationError ? (
          <WarningIcon />
        ) : null}
        <p className={classes.infoMessage}>{infoMessage}</p>
      </div>
    </div>
  );
};
