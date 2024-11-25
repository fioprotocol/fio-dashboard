import React from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { FadeLoader } from 'react-spinners';
import classnames from 'classnames';

import classes from './VerificationLoader.module.scss';

export type VerificationLoaderProps = {
  hasFioVerificationError: boolean;
  hasVerifiedError: boolean;
  isVerified: boolean;
  infoMessage: string;
  loaderText: string;
  verifyLoading: boolean;
  loaderPadding?: boolean;
  overlay?: boolean;
};

export const VerificationLoader: React.FC<VerificationLoaderProps> = props => {
  const {
    hasFioVerificationError,
    hasVerifiedError,
    isVerified,
    infoMessage,
    loaderText,
    verifyLoading,
    overlay = true,
  } = props;

  return (
    <div className={classes.container}>
      {verifyLoading && (
        <div
          className={classnames(
            classes.loader,
            overlay && classes.overlay,
            'mt-4',
          )}
        >
          <FadeLoader
            height="8px"
            width="5px"
            radius="3px"
            margin="1px"
            color="rgb(118, 92, 214)"
          />
          <p>{loaderText}</p>
        </div>
      )}
      <div
        className={classnames(
          classes.infoBadge,
          (hasVerifiedError || hasFioVerificationError) &&
            classes.hasVerifiedError,
          isVerified && classes.isVerified,
          hasFioVerificationError && classes.hasFioVerificactionError,
        )}
      >
        {isVerified && !hasVerifiedError && !hasFioVerificationError ? (
          <CheckCircleIcon />
        ) : hasVerifiedError || hasFioVerificationError ? (
          <WarningIcon />
        ) : (
          <InfoIcon />
        )}
        <p className={classes.infoMessage}>{infoMessage}</p>
      </div>
    </div>
  );
};
