import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import { BUTTONS_TITLE } from '../constants';
import { ROUTES } from '../../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../../constants/queryParams';

import { useCheckIfSmallDesktop } from '../../../screenType';

import icon from '../../../assets/images/timelapse_white_24dp.svg'; // todo: remove after changing library to google material
import wrapIcon from '../../../assets/images/wrap.svg';

import { FioNameItemProps } from '../../../types';

import classes from './ActionButtons.module.scss';

type DefautProps = {
  isSmallDesktop: boolean;
  name: string;
};

export const AddBundlesActionButton: React.FC<{
  name: string;
  isMobileView?: boolean;
  onAddBundles: (name: string) => void;
}> = props => {
  const { name, isMobileView, onAddBundles } = props;
  const isSmallDesktop = useCheckIfSmallDesktop();
  const handleAddBundles = () => {
    onAddBundles(name);
  };

  return (
    <div className={classes.actionButtonsContainer}>
      <div
        onClick={handleAddBundles}
        className={classnames(
          classes.actionButton,
          isMobileView && classes.mobileView,
        )}
      >
        <Button title={isSmallDesktop ? BUTTONS_TITLE.addBundles : ''}>
          <FontAwesomeIcon icon="plus-square" className={classes.linkIcon} />
          {!isSmallDesktop && BUTTONS_TITLE.addBundles}
        </Button>
      </div>
    </div>
  );
};

const RenewActionButton: React.FC<{
  onRenewDomain: (name: string) => void;
} & DefautProps> = props => {
  const { isSmallDesktop, name, onRenewDomain } = props;

  const handleRenewDomain = useCallback(() => {
    onRenewDomain(name);
  }, [name, onRenewDomain]);

  return (
    <div onClick={handleRenewDomain} className={classes.actionButton}>
      <Button title={isSmallDesktop ? BUTTONS_TITLE.renew : ''}>
        <img src={icon} alt="timelapse" />
        {!isSmallDesktop && BUTTONS_TITLE.renew}
      </Button>
    </div>
  );
};

const WrapActionButton: React.FC<DefautProps> = props => {
  const { isSmallDesktop, name } = props;
  return (
    <Link
      to={`${ROUTES.WRAP_DOMAIN}?name=${name}`}
      className={classes.actionButton}
    >
      <Button title={isSmallDesktop ? BUTTONS_TITLE.wrap : ''}>
        <img src={wrapIcon} alt="wrap" />
        {!isSmallDesktop && BUTTONS_TITLE.wrap}
      </Button>
    </Link>
  );
};

const FchCustomSelection: React.FC<DefautProps> = props => {
  const { isSmallDesktop, name } = props;

  return (
    <Link
      to={{
        pathname: ROUTES.FIO_ADDRESSES_CUSTOM_SELECTION,
        search: `${QUERY_PARAMS_NAMES.DOMAIN}=${name}`,
        state: {
          shouldPrependUserDomains: true,
          closedInitialDropdown: true,
          removeFilter: true,
        },
      }}
      className={classes.actionButton}
    >
      <Button title={isSmallDesktop ? BUTTONS_TITLE.register : ''}>
        <FontAwesomeIcon icon="at" className={classes.atIcon} />
        {!isSmallDesktop && BUTTONS_TITLE.register}
      </Button>
    </Link>
  );
};

const SettingsActionButton: React.FC<{
  fioNameItem: FioNameItemProps;
  onSettingsOpen: (data: FioNameItemProps) => void;
}> = props => {
  const { fioNameItem, onSettingsOpen } = props;
  return (
    <Button
      className={classes.settingsButton}
      onClick={() => {
        onSettingsOpen && onSettingsOpen(fioNameItem);
      }}
    >
      <FontAwesomeIcon icon="cog" className={classes.settingsIcon} />
    </Button>
  );
};

const LinkTokenActionButton: React.FC<DefautProps> = props => {
  const { isSmallDesktop, name } = props;
  return (
    <Link
      to={`${ROUTES.LINK_TOKEN_LIST}?${QUERY_PARAMS_NAMES.FIO_CRYPTO_HANDLE}=${name}`}
      className={classes.actionButton}
    >
      <Button title={isSmallDesktop ? BUTTONS_TITLE.link : ''}>
        <FontAwesomeIcon icon="link" className={classes.linkIcon} />{' '}
        {!isSmallDesktop && BUTTONS_TITLE.link}
      </Button>
    </Link>
  );
};

const FioRequestActionButton: React.FC<DefautProps> = props => {
  const { isSmallDesktop, name } = props;

  return (
    <Link
      to={{
        pathname: ROUTES.FIO_TOKENS_REQUEST,
        state: {
          payeeFioAddress: name,
        },
      }}
      className={classes.actionButton}
    >
      <Button title={isSmallDesktop ? BUTTONS_TITLE.request : ''}>
        <FontAwesomeIcon icon="arrow-down" className={classes.linkIcon} />
        {!isSmallDesktop && BUTTONS_TITLE.request}
      </Button>
    </Link>
  );
};

const NftSignatureActionButton: React.FC<DefautProps> = props => {
  const { isSmallDesktop, name } = props;
  return (
    <Link
      to={{
        pathname: ROUTES.FIO_ADDRESS_SIGNATURES,
        search: `${QUERY_PARAMS_NAMES.ADDRESS}=${name}`,
      }}
      className={classes.actionButton}
    >
      <Button title={isSmallDesktop ? BUTTONS_TITLE.nft : ''}>
        <FontAwesomeIcon icon="signature" className={classes.atIcon} />{' '}
        {!isSmallDesktop && BUTTONS_TITLE.nft}
      </Button>
    </Link>
  );
};

const SocialLinksActionButton: React.FC<DefautProps> = props => {
  const { isSmallDesktop, name } = props;

  return (
    <Link
      to={{
        pathname: ROUTES.FIO_SOCIAL_MEDIA_LINKS,
        search: `${QUERY_PARAMS_NAMES.FIO_CRYPTO_HANDLE}=${name}`,
      }}
      className={classes.actionButton}
    >
      <Button title={isSmallDesktop ? BUTTONS_TITLE.socialLinks : ''}>
        <span className={classes.prefixButtonText}>@</span>&nbsp;
        {!isSmallDesktop && BUTTONS_TITLE.socialLinks}
      </Button>
    </Link>
  );
};

const ActionButtonsContainer: React.FC = props => (
  <div className={classes.actionButtonsContainer}>{props.children}</div>
);

export const FchActionButtons: React.FC<{
  fioNameItem: FioNameItemProps;
  name: string;
  onSettingsOpen: (data: FioNameItemProps) => void;
}> = props => {
  const { fioNameItem, name, onSettingsOpen } = props;
  const isSmallDesktop = useCheckIfSmallDesktop();

  const defaultProps = {
    isSmallDesktop,
    name,
  };

  return (
    <ActionButtonsContainer>
      <NftSignatureActionButton {...defaultProps} />
      <FioRequestActionButton {...defaultProps} />
      <LinkTokenActionButton {...defaultProps} />
      <SocialLinksActionButton {...defaultProps} />
      <SettingsActionButton
        fioNameItem={fioNameItem}
        onSettingsOpen={onSettingsOpen}
      />
    </ActionButtonsContainer>
  );
};

export const DomainActionButtons: React.FC<{
  fioNameItem: FioNameItemProps;
  name: string;
  onRenewDomain: (name: string) => void;
  onSettingsOpen: (data: FioNameItemProps) => void;
}> = props => {
  const { fioNameItem, name, onRenewDomain, onSettingsOpen } = props;
  const isSmallDesktop = useCheckIfSmallDesktop();

  const defaultProps = {
    isSmallDesktop,
    name,
  };

  return (
    <ActionButtonsContainer>
      <RenewActionButton {...defaultProps} onRenewDomain={onRenewDomain} />
      <WrapActionButton {...defaultProps} />
      <FchCustomSelection {...defaultProps} />
      <SettingsActionButton
        fioNameItem={fioNameItem}
        onSettingsOpen={onSettingsOpen}
      />
    </ActionButtonsContainer>
  );
};
