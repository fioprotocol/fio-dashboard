import React from 'react';

import PseudoModalContainer from '../PseudoModalContainer';

import { ROUTES } from '../../constants/routes';
import { WRAPPING_DISABLED_MESSAGE } from '../../constants/wrap';

import config from '../../config';

import classes from './WrappingUnavailable.module.scss';

// Shown on the wrap/unwrap routes while wrapping is disabled.
export const WrappingUnavailable: React.FC = () => (
  <PseudoModalContainer title="Wrapping unavailable" link={ROUTES.FIO_WALLETS}>
    <div className={classes.container}>
      <p>{WRAPPING_DISABLED_MESSAGE}</p>
      <p>
        Please do not send FIO tokens or FIO Domains to the bridge until this
        notice is removed. If you have a pending wrap or unwrap, please{' '}
        <a href={config.supportUrl} target="_blank" rel="noreferrer">
          contact support
        </a>
        .
      </p>
    </div>
  </PseudoModalContainer>
);
