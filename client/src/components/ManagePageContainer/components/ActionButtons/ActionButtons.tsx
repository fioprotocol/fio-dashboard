import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import GestureIcon from '@mui/icons-material/Gesture';
import LinkIcon from '@mui/icons-material/Link';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import TimelapseIcon from '@mui/icons-material/Timelapse';

import { BUTTONS_TITLE } from '../../constants';
import { ROUTES } from '../../../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../../../constants/queryParams';

import { useCheckIfSmallDesktop } from '../../../../screenType';

import { FioNameItemProps } from '../../../../types';

import classes from './ActionButtons.module.scss';

type DefautProps = {
  isExpired?: boolean;
  isSmallDesktop: boolean;
  name: string;
};

export const AddBundlesActionButton: React.FC<{
  name: string;
  isExpired: boolean;
  isMobileView?: boolean;
  onAddBundles: (name: string) => void;
}> = props => {
  const { name, isExpired, isMobileView, onAddBundles } = props;
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
        <Button
          title={isSmallDesktop ? BUTTONS_TITLE.addBundles : ''}
          disabled={isExpired}
        >
          <AddCircleIcon className={classes.linkIcon} />
          {!isSmallDesktop && BUTTONS_TITLE.addBundles}
        </Button>
      </div>
    </div>
  );
};

export const RenewActionButton: React.FC<{
  onRenewDomain: (name: string) => void;
} & DefautProps> = props => {
  const { isSmallDesktop, name, onRenewDomain } = props;

  const handleRenewDomain = useCallback(() => {
    onRenewDomain(name);
  }, [name, onRenewDomain]);

  return (
    <div onClick={handleRenewDomain} className={classes.actionButton}>
      <Button title={isSmallDesktop ? BUTTONS_TITLE.renew : ''}>
        <TimelapseIcon />
        {!isSmallDesktop && BUTTONS_TITLE.renew}
      </Button>
    </div>
  );
};

const WrapActionButton: React.FC<DefautProps & {
  isHidden?: boolean;
}> = props => {
  const { isExpired, isHidden, isSmallDesktop, name } = props;
  return (
    <Link
      to={`${ROUTES.WRAP_DOMAIN}?name=${name}`}
      className={classnames(classes.actionButton, isHidden && classes.isHidden)}
    >
      <Button
        title={isSmallDesktop ? BUTTONS_TITLE.wrap : ''}
        disabled={isExpired}
      >
        <RefreshIcon />
        {!isSmallDesktop && BUTTONS_TITLE.wrap}
      </Button>
    </Link>
  );
};

const FchCustomSelection: React.FC<DefautProps & {
  isHidden?: boolean;
}> = props => {
  const { isExpired, isHidden, isSmallDesktop, name } = props;

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
      className={classnames(classes.actionButton, isHidden && classes.isHidden)}
    >
      <Button
        title={isSmallDesktop ? BUTTONS_TITLE.register : ''}
        disabled={isExpired}
      >
        <span className={classes.prefixButtonText}>@</span>&nbsp;
        {!isSmallDesktop && BUTTONS_TITLE.register}
      </Button>
    </Link>
  );
};

const SettingsActionButton: React.FC<{
  fioNameItem: FioNameItemProps;
  isExpired: boolean;
  onSettingsOpen: ({
    fioNameItem,
    isExpired,
  }: {
    fioNameItem: FioNameItemProps;
    isExpired?: boolean;
  }) => void;
}> = props => {
  const { fioNameItem, isExpired, onSettingsOpen } = props;
  return (
    <Button
      className={classes.settingsButton}
      onClick={() => {
        onSettingsOpen && onSettingsOpen({ fioNameItem, isExpired });
      }}
    >
      <SettingsIcon className={classes.settingsIcon} />
    </Button>
  );
};

const LinkTokenActionButton: React.FC<DefautProps> = props => {
  const { isExpired, isSmallDesktop, name } = props;
  return (
    <Link
      to={`${ROUTES.LINK_TOKEN_LIST}?${QUERY_PARAMS_NAMES.FIO_HANDLE}=${name}`}
      className={classes.actionButton}
    >
      <Button
        title={isSmallDesktop ? BUTTONS_TITLE.link : ''}
        disabled={isExpired}
      >
        <LinkIcon className={classes.linkIcon} />{' '}
        {!isSmallDesktop && BUTTONS_TITLE.link}
      </Button>
    </Link>
  );
};

const FioRequestActionButton: React.FC<DefautProps> = props => {
  const { isExpired, isSmallDesktop, name } = props;

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
      <Button
        title={isSmallDesktop ? BUTTONS_TITLE.request : ''}
        disabled={isExpired}
      >
        <ArrowDownwardIcon className={classes.linkIcon} />
        {!isSmallDesktop && BUTTONS_TITLE.request}
      </Button>
    </Link>
  );
};

const NftSignatureActionButton: React.FC<DefautProps> = props => {
  const { isExpired, isSmallDesktop, name } = props;
  return (
    <Link
      to={{
        pathname: ROUTES.FIO_ADDRESS_SIGNATURES,
        search: `${QUERY_PARAMS_NAMES.ADDRESS}=${name}`,
      }}
      className={classes.actionButton}
    >
      <Button
        title={isSmallDesktop ? BUTTONS_TITLE.nft : ''}
        disabled={isExpired}
      >
        <GestureIcon className={classes.atIcon} />{' '}
        {!isSmallDesktop && BUTTONS_TITLE.nft}
      </Button>
    </Link>
  );
};

const SocialLinksActionButton: React.FC<DefautProps> = props => {
  const { isExpired, isSmallDesktop, name } = props;

  return (
    <Link
      to={{
        pathname: ROUTES.FIO_SOCIAL_MEDIA_LINKS,
        search: `${QUERY_PARAMS_NAMES.FIO_HANDLE}=${name}`,
      }}
      className={classes.actionButton}
    >
      <Button
        title={isSmallDesktop ? BUTTONS_TITLE.socialLinks : ''}
        disabled={isExpired}
      >
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
  isExpired: boolean;
  onSettingsOpen: ({
    fioNameItem,
    isExpired,
  }: {
    fioNameItem: FioNameItemProps;
    isExpired?: boolean;
  }) => void;
}> = props => {
  const { fioNameItem, isExpired, onSettingsOpen } = props;
  const { name } = fioNameItem;
  const isSmallDesktop = useCheckIfSmallDesktop();

  const defaultProps = {
    isExpired,
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
        isExpired={isExpired}
        onSettingsOpen={onSettingsOpen}
      />
    </ActionButtonsContainer>
  );
};

export const DomainActionButtons: React.FC<{
  fioNameItem: FioNameItemProps;
  isDesktop?: boolean;
  isDomainWatchlist?: boolean;
  isExpired: boolean;
  onRenewDomain: (name: string) => void;
  onSettingsOpen: ({
    fioNameItem,
    isExpired,
  }: {
    fioNameItem: FioNameItemProps;
    isExpired?: boolean;
  }) => void;
}> = props => {
  const {
    fioNameItem,
    isDesktop,
    isDomainWatchlist,
    isExpired,
    onRenewDomain,
    onSettingsOpen,
  } = props;

  const { isPublic, name } = fioNameItem;

  const isSmallDesktop = useCheckIfSmallDesktop();

  const defaultProps = {
    isExpired,
    isSmallDesktop,
    name,
  };

  const hideCustomSelection = isDomainWatchlist && !isPublic;

  if (isDomainWatchlist) {
    return (
      <ActionButtonsContainer>
        <RenewActionButton {...defaultProps} onRenewDomain={onRenewDomain} />
        {(isDesktop || (!isDesktop && !hideCustomSelection)) && (
          <FchCustomSelection
            {...defaultProps}
            isHidden={hideCustomSelection}
          />
        )}

        {isDesktop ? <WrapActionButton {...defaultProps} isHidden /> : null}
        <SettingsActionButton
          fioNameItem={fioNameItem}
          isExpired={isExpired}
          onSettingsOpen={onSettingsOpen}
        />
      </ActionButtonsContainer>
    );
  }

  return (
    <ActionButtonsContainer>
      <RenewActionButton {...defaultProps} onRenewDomain={onRenewDomain} />
      <WrapActionButton {...defaultProps} />
      <FchCustomSelection {...defaultProps} />
      <SettingsActionButton
        fioNameItem={fioNameItem}
        isExpired={isExpired}
        onSettingsOpen={onSettingsOpen}
      />
    </ActionButtonsContainer>
  );
};
