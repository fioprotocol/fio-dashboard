import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import classnames from 'classnames';

import Badge, { BADGE_TYPES } from '../../../Badge/Badge';
import PageTitle from '../../../PageTitle/PageTitle';
import SubmitButton from '../../../common/SubmitButton/SubmitButton';

import { LINKS } from '../../../../constants/labels';
import { ROUTES } from '../../../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../../../constants/queryParams';

import { FioNameItemProps, FioWalletDoublet } from '../../../../types';

import classes from './SettingsItem.module.scss';

type FchSettingsItemProps = {
  fioNameItem: FioNameItemProps;
  fioWallets: FioWalletDoublet[];
};

type DomainSettingsItemProps = {
  fioNameItem: FioNameItemProps;
  fioWallets: FioWalletDoublet[];
};

type DomainsWatchlistSettingsItemProps = {
  account?: string;
  name: string;
  publicKey?: string;
  loading: boolean;
  onDomainDeleteAction: () => void;
};

export const FchSettingsItem: React.FC<FchSettingsItemProps> = props => {
  const { fioNameItem, fioWallets } = props;

  const { name } = fioNameItem;
  const { publicKey, name: walletName } =
    fioWallets.find(
      (fioWallet: FioWalletDoublet) =>
        fioWallet.publicKey === fioNameItem.walletPublicKey,
    ) || {};

  return (
    <div className={classes.settingsContainer}>
      <PageTitle link={LINKS.FIO_ADDRESSES_SETTINGS} isVirtualPage />
      <h3 className={classes.title}>Advanced Settings</h3>
      <h5 className={classes.subtitle}>FIO Crypto Handle Ownership</h5>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classes.badgeContainer}>
          <p className={classes.badgeTitle}>FIO Wallet</p>
          <p className={classes.badgeItem}>{walletName}</p>
        </div>
      </Badge>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classes.badgeContainer}>
          <p className={classes.badgeTitle}>Public Key</p>
          <p className={classes.badgeItem}>{publicKey}</p>
        </div>
      </Badge>
      <div>
        <h5 className={classes.actionTitle}>
          Transfer FIO Crypto Handle Ownership
        </h5>
        <p className={classes.text}>
          Transferring your FIO Crypto Handle to a new Owner is easy, Simply
          enter or paste the new owner public key, submit the request and verify
          the transaction.
        </p>
        <Link
          to={`${ROUTES.FIO_ADDRESS_OWNERSHIP}?${QUERY_PARAMS_NAMES.NAME}=${name}`}
          className={classes.buttonLink}
        >
          <Button className={classes.button}>Start Transfer</Button>
        </Link>
      </div>
    </div>
  );
};

export const DomainSettingsItem: React.FC<DomainSettingsItemProps> = props => {
  const { fioNameItem, fioWallets } = props;

  const { name: fioName } = fioNameItem;
  const { publicKey, name: walletName } =
    fioWallets.find(
      (fioWallet: FioWalletDoublet) =>
        fioWallet.publicKey === fioNameItem.walletPublicKey,
    ) || {};

  return (
    <div className={classes.settingsContainer}>
      <PageTitle link={LINKS.FIO_DOMAINS_SETTINGS} isVirtualPage />
      <h3 className={classes.title}>Advanced Settings</h3>
      <h5 className={classes.subtitle}>FIO Domain Ownership</h5>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.withLink)}>
          <p className={classes.badgeTitle}>Domain</p>
          <p className={classnames(classes.badgeItem, classes.withLink)}>
            {fioName}
          </p>
          <a
            href={`${process.env.REACT_APP_FIO_BLOCKS_BASE_URL}domain/${fioName}`}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.link}
          >
            <ExitToAppIcon />
          </a>
        </div>
      </Badge>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classes.badgeContainer}>
          <p className={classes.badgeTitle}>FIO Wallet</p>
          <p className={classes.badgeItem}>{walletName}</p>
        </div>
      </Badge>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.withLink)}>
          <p className={classes.badgeTitle}>Public Key</p>
          <p className={classnames(classes.badgeItem, classes.withLink)}>
            {publicKey}
          </p>
          <a
            href={`${process.env.REACT_APP_FIO_BLOCKS_BASE_URL}key/${publicKey}`}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.link}
          >
            <ExitToAppIcon />
          </a>
        </div>
      </Badge>
      <div>
        <h5 className={classes.actionTitle}>Domain Access</h5>
        <p className={classes.text}>
          If you would like your domain to be publicly giving users the ability
          to register FIO Crypto Handles on it, please set the domain to public.
        </p>
        <Link
          to={`${ROUTES.FIO_DOMAIN_STATUS_CHANGE}?${QUERY_PARAMS_NAMES.NAME}=${fioName}`}
          className={classes.buttonLink}
        >
          <Button className={classes.button}>
            Make Domain {fioNameItem.isPublic ? 'Private' : 'Public'}
          </Button>
        </Link>
      </div>
      <div>
        <h5 className={classes.actionTitle}>Transfer FIO Domain Ownership</h5>
        <p className={classes.text}>
          Transferring your FIO Domain to a new Owner is easy, Simply enter or
          paste the new owner public key, submit the request and verify the
          transaction.
        </p>
        <Link
          to={`${ROUTES.FIO_DOMAIN_OWNERSHIP}?${QUERY_PARAMS_NAMES.NAME}=${fioName}`}
          className={classes.buttonLink}
        >
          <Button className={classes.button}>Start Transfer</Button>
        </Link>
      </div>
      <div>
        <h5 className={classes.actionTitle}>FIO Domain Wrapping</h5>
        <p className={classes.text}>
          Wrapping your FIO domain allows you to transport your domain to
          another network chain. Simply paste a public address or connect a
          wallet and initiate wrapping.
        </p>
        <Link
          to={`${ROUTES.WRAP_DOMAIN}?name=${fioName}`}
          className={classes.buttonLink}
        >
          <Button className={classes.button}>Start Wrapping</Button>
        </Link>
      </div>
      <div>
        <h5 className={classes.actionTitle}>FIO Domain Unwrapping</h5>
        <p className={classes.text}>
          Unwrapping FIO domain allows you to transport your domain to FIO
          network chain. Simply connect a wallet and initiate unwrapping.
        </p>
        <Link to={ROUTES.UNWRAP_DOMAIN} className={classes.buttonLink}>
          <Button className={classes.button}>Start Unwrapping</Button>
        </Link>
      </div>
    </div>
  );
};

export const DomainsWatchlistSettingsItem: React.FC<DomainsWatchlistSettingsItemProps> = props => {
  const { account, name, loading, publicKey, onDomainDeleteAction } = props;

  return (
    <div className={classes.settingsContainer}>
      <PageTitle link={LINKS.FIO_DOMAINS_SETTINGS} isVirtualPage />
      <h3 className={classes.title}>Advanced Settings</h3>
      <h5 className={classes.subtitle}>FIO Domain Ownership</h5>
      <Badge show={true} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.withLink)}>
          <p className={classes.badgeTitle}>Domain</p>
          <p className={classnames(classes.badgeItem, classes.withLink)}>
            {name}
          </p>
          <a
            href={`${process.env.REACT_APP_FIO_BLOCKS_BASE_URL}domain/${name}`}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.link}
          >
            <ExitToAppIcon />
          </a>
        </div>
      </Badge>
      <Badge show={!!publicKey} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.withLink)}>
          <p className={classes.badgeTitle}>Public Key</p>
          <p className={classnames(classes.badgeItem, classes.withLink)}>
            {publicKey}
          </p>
          <a
            href={`${process.env.REACT_APP_FIO_BLOCKS_BASE_URL}key/${publicKey}`}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.link}
          >
            <ExitToAppIcon />
          </a>
        </div>
      </Badge>
      <Badge show={!!account} type={BADGE_TYPES.WHITE}>
        <div className={classnames(classes.badgeContainer, classes.withLink)}>
          <p className={classes.badgeTitle}>Account</p>
          <p className={classnames(classes.badgeItem, classes.withLink)}>
            {account}
          </p>
          <a
            href={`${process.env.REACT_APP_FIO_BLOCKS_BASE_URL}account/${account}`}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.link}
          >
            <ExitToAppIcon />
          </a>
        </div>
      </Badge>
      <div>
        <h5 className={classes.actionTitle}>Domain Watchlist</h5>
        <p className={classes.text}>Remove this domain from your watchlist.</p>
        <SubmitButton
          text="Remove Now"
          loading={loading}
          onClick={onDomainDeleteAction}
          hasAutoWidth
          withBottomMargin
        />
      </div>
    </div>
  );
};
