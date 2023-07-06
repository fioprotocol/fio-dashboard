import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import { BUTTONS_TITLE, PAGE_NAME } from '../constants';
import { ROUTES } from '../../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../../constants/queryParams';

import { useCheckIfSmallDesktop } from '../../../screenType';

import { ActionButtonProps } from '../types';

import classes from './ActionButtons.module.scss';

import icon from '../../../assets/images/timelapse_white_24dp.svg'; // todo: remove after changing library to google material
import wrapIcon from '../../../assets/images/wrap.svg';

export const RenderAddBundles: React.FC<{
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

const ActionButtons: React.FC<ActionButtonProps> = props => {
  const {
    pageName,
    isDesktop,
    onSettingsOpen,
    fioNameItem,
    onRenewDomain,
  } = props;
  const { name = '' } = fioNameItem;

  const isSmallDesktop = useCheckIfSmallDesktop();
  const handleRenewDomain = () => {
    onRenewDomain(name);
  };

  const renderRenew = () => (
    <div onClick={handleRenewDomain} className={classes.actionButton}>
      <Button title={isSmallDesktop ? BUTTONS_TITLE.renew : ''}>
        <img src={icon} alt="timelapse" />
        {!isSmallDesktop && BUTTONS_TITLE.renew}
      </Button>
    </div>
  );

  const renderWrap = () => (
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

  const renderSettings = () => (
    <Button
      className={classes.settingsButton}
      onClick={() => {
        onSettingsOpen && onSettingsOpen(fioNameItem);
      }}
    >
      <FontAwesomeIcon icon="cog" className={classes.settingsIcon} />
    </Button>
  );

  const renderLinkToken = () => (
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

  const renderFioRequest = () => (
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

  return pageName === PAGE_NAME.ADDRESS ? (
    <div className={classes.actionButtonsContainer}>
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
      {renderFioRequest()}
      {renderLinkToken()}
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
      {renderSettings()}
    </div>
  ) : (
    <div className={classes.actionButtonsContainer}>
      {renderRenew()}
      {renderWrap()}
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
          {!isSmallDesktop &&
            (isDesktop ? BUTTONS_TITLE.register : 'Register FIO Crypto Handle')}
        </Button>
      </Link>
      {renderSettings()}
    </div>
  );
};

export default ActionButtons;
