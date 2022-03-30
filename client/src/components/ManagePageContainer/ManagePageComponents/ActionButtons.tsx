import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import { PAGE_NAME, BUTTONS_TITLE } from '../constants';
import { ROUTES } from '../../../constants/routes';

import { useCheckIfSmallDesktop } from '../../../screenType';
import { putParamsToUrl } from '../../../utils';

import { ActionButtonProps } from '../types';

import classes from './ActionButtons.module.scss';

import icon from '../../../assets/images/timelapse_white_24dp.svg'; // todo: remove after changing library to google material

export const RenderAddBundles: React.FC<{
  name: string;
  isMobileView?: boolean;
}> = props => {
  const { name, isMobileView } = props;
  const isSmallDesktop = useCheckIfSmallDesktop();

  return (
    <div className={classes.actionButtonsContainer}>
      <Link
        to={`${ROUTES.FIO_ADDRESS_ADD_BUNDLES}/${name}`}
        className={classnames(
          classes.actionButton,
          isMobileView && classes.mobileView,
        )}
      >
        <Button title={isSmallDesktop ? BUTTONS_TITLE.addBundles : ''}>
          <FontAwesomeIcon icon="plus-square" className={classes.linkIcon} />
          {!isSmallDesktop && BUTTONS_TITLE.addBundles}
        </Button>
      </Link>
    </div>
  );
};

const ActionButtons: React.FC<ActionButtonProps> = props => {
  const { pageName, isDesktop, onSettingsOpen, fioNameItem } = props;
  const { name = '' } = fioNameItem;

  const isSmallDesktop = useCheckIfSmallDesktop();

  const renderRenew = () => (
    <Link
      to={`${ROUTES.FIO_DOMAIN_RENEW}/${name}`}
      className={classes.actionButton}
    >
      <Button title={isSmallDesktop ? BUTTONS_TITLE.renew : ''}>
        <img src={icon} alt="timelapse" />
        {!isSmallDesktop && BUTTONS_TITLE.renew}
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
      to={`${ROUTES.LINK_TOKEN_LIST}/${name}`}
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
        pathname: putParamsToUrl(ROUTES.FIO_TOKENS_REQUEST, { publicKey: '' }),
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
        to={`${ROUTES.FIO_ADDRESS_SIGNATURES}`.replace(':address', name)}
        className={classes.actionButton}
      >
        <Button title={isSmallDesktop ? BUTTONS_TITLE.nft : ''}>
          <FontAwesomeIcon icon="signature" className={classes.atIcon} />{' '}
          {!isSmallDesktop && BUTTONS_TITLE.nft}
        </Button>
      </Link>
      {renderFioRequest()}
      {renderLinkToken()}
      {renderSettings()}
    </div>
  ) : (
    <div className={classes.actionButtonsContainer}>
      {renderRenew()}
      <Link
        to={ROUTES.FIO_ADDRESSES_SELECTION}
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
