import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import Badge, { BADGE_TYPES } from '../../Badge/Badge';

import { FIO_OWNERSHIP } from '../constants';
import { fioNameLabels } from '../../../constants/labels';
import { ROUTES } from '../../../constants/routes';

import { FioWalletDoublet } from '../../../types';
import { SettingsProps } from '../types';

import classes from './SettingsItem.module.scss';

const SettingsItem: React.FC<SettingsProps> = props => {
  const { fioNameItem, pageName, fioWallets, showStatus } = props;
  const { name: fioName } = fioNameItem;
  const { publicKey, name: walletName } =
    fioWallets.find(
      (fioWallet: FioWalletDoublet) =>
        fioWallet.publicKey === fioNameItem.walletPublicKey,
    ) || {};

  return (
    <div className={classes.settingsContainer}>
      <h3 className={classes.title}>Advanced Settings</h3>
      <h5 className={classes.subtitle}>{fioNameLabels[pageName]} Ownership</h5>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <p className={classes.badgeTitle}>FIO Wallet</p>
        <p className={classes.badgeItem}>{walletName}</p>
      </Badge>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classes.badgeContainer}>
          <p className={classes.badgeTitle}>Public Key</p>
          <p className={classes.badgeItem}>{publicKey}</p>
        </div>
      </Badge>
      {showStatus && (
        <div>
          <h5 className={classes.actionTitle}>Domain Access</h5>
          <p className={classes.text}>
            If you would like your domain to be publicly giving users the
            ability to register FIO Crypto Handles on it, please set the domain
            to public.
          </p>
          <Link
            to={`${ROUTES.FIO_DOMAIN_STATUS_CHANGE}/${fioName}`}
            className={classes.buttonLink}
          >
            <Button className={classes.button}>
              Make Domain {fioNameItem.isPublic ? 'Private' : 'Public'}
            </Button>
          </Link>
        </div>
      )}
      <div>
        <h5 className={classes.actionTitle}>
          Transfer {fioNameLabels[pageName]} Ownership
        </h5>
        <p className={classes.text}>
          Transferring your {fioNameLabels[pageName]} to a new Owner is easy,
          Simply enter or paste the new owner public key, submit the request and
          verify the transaction.
        </p>
        <Link
          to={`${FIO_OWNERSHIP[pageName]}/${fioName}`}
          className={classes.buttonLink}
        >
          <Button className={classes.button}>Start Transfer</Button>
        </Link>
      </div>
    </div>
  );
};

export default SettingsItem;
