import React from 'react';

import NewReleasesIcon from '@mui/icons-material/NewReleases';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

import SubmitButton from '../common/SubmitButton/SubmitButton';

import MetamaskImgSrc from '../../assets/images/metamask.svg';

import classes from './GateVerificationComponent.module.scss';

type Props = {
  parnterName: string;
  refDomain: string;
};

export const GateVerificationComponent: React.FC<Props> = props => {
  const { parnterName, refDomain } = props;

  return (
    <div className={classes.container}>
      <NewReleasesIcon />
      <p className={classes.text}>
        Registration of FIO Handles on the{' '}
        <span className={classes.boldText}>@{refDomain}</span> domain is
        reserved only for holders of {parnterName} NFTs.{' '}
        <span className={classes.boldText}>
          Connect your Metamask wallet to complete validation and register your
          FIO handle.
        </span>
      </p>

      <SubmitButton
        onClick={() => {}}
        text={
          <div className={classes.metamask}>
            <img
              src={MetamaskImgSrc}
              alt="metamask-logo"
              className={classes.logo}
            />{' '}
            Connect Metamask
          </div>
        }
        withBottomMargin
        hasLowHeight
        hasAutoWidth
      />
      <div className={classes.securityNote}>
        <VerifiedUserOutlinedIcon />
        <p className={classes.securityNoteText}>
          Security Note: Connection of your Metamask wallet is used for
          validation purposes only.
        </p>
      </div>
    </div>
  );
};
