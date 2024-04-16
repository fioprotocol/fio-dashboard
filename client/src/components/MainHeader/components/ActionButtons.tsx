import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Nav } from 'react-bootstrap';
import SettingsIcon from '@mui/icons-material/Settings';
import classnames from 'classnames';

import Navigation from '../../Navigation';
import Loader from '../../Loader/Loader';

import { ROUTES } from '../../../constants/routes';

import metamaskSrc from '../../../assets/images/metamask.svg';
import operaSrc from '../../../assets/images/opera.svg';

import classes from '../MainHeader.module.scss';

type ActionButtonsProps = {
  edgeAuthLoading: boolean;
  hasVioletColor?: boolean;
  profileLoading: boolean;
  isMenuOpen: boolean;
  onlyAuth: boolean;
  hideSettings?: boolean;
  showLogin: () => void;
  closeMenu: () => void;
};

type LoggedActionButtonsProps = ActionButtonsProps & {
  logout: () => void;
};

export const ActionButtons: React.FC<ActionButtonsProps> = props => {
  const {
    showLogin,
    edgeAuthLoading,
    hasVioletColor,
    profileLoading,
    isMenuOpen,
    closeMenu,
    onlyAuth,
  } = props;
  return (
    <div
      className={classnames(
        classes.actionContainer,
        isMenuOpen && classes.isOpen,
      )}
    >
      {onlyAuth ? null : (
        <Nav.Link
          as={Link}
          to={ROUTES.CREATE_ACCOUNT}
          className="flex-shrink-0"
        >
          <Button
            variant="outline-primary"
            className={classnames(
              classes.button,
              classes.hasTransparentBackground,
              hasVioletColor && classes.hasVioletColor,
              'mr-3',
            )}
            size="lg"
            onClick={closeMenu}
          >
            Create Account
          </Button>
        </Nav.Link>
      )}
      <Nav.Link className="pr-0">
        <Button
          className={classes.button}
          size="lg"
          onClick={showLogin}
          disabled={edgeAuthLoading}
        >
          <p className={classes.buttonText}>Sign In</p>
          {(edgeAuthLoading || profileLoading) && (
            <Loader isWhite className={classes.buttonLoader} />
          )}
        </Button>
      </Nav.Link>
    </div>
  );
};

export const LoggedActionButtons: React.FC<LoggedActionButtonsProps> = props => {
  const {
    logout,
    edgeAuthLoading,
    profileLoading,
    isMenuOpen,
    onlyAuth,
    hideSettings,
    closeMenu,
  } = props;

  if (onlyAuth) {
    return (
      <div
        className={classnames(
          classes.loggedActionButtons,
          isMenuOpen && classes.isOpen,
        )}
      >
        <Nav.Link href="#" className="pr-0 pl-0">
          <Button
            className={classnames(classes.button, !isMenuOpen && 'ml-3')}
            onClick={logout}
            size="lg"
            disabled={edgeAuthLoading}
          >
            <p className={classes.buttonText}>Sign Out </p>
            {(edgeAuthLoading || profileLoading) && (
              <Loader isWhite className={classes.buttonLoader} />
            )}
          </Button>
        </Nav.Link>
      </div>
    );
  }

  const isOperaWallet = window.ethereum?.isOpera;
  const isMetamaskWallet = window.ethereum?.isMetaMask;
  const isAlternativeWallet = isMetamaskWallet || isOperaWallet;

  return (
    <div
      className={classnames(
        classes.loggedActionButtons,
        isMenuOpen && classes.isOpen,
      )}
    >
      {isMenuOpen && <Navigation isOnSide={isMenuOpen} closeMenu={closeMenu} />}
      {isMenuOpen && <hr className={classes.horizontal} />}
      {!hideSettings && (
        <Nav.Link
          as={Link}
          to={ROUTES.SETTINGS}
          className={classes.navItem}
          onClick={closeMenu}
        >
          <div className={classes.settings}>
            <SettingsIcon className={classes.settingsIcon} />
          </div>
          <div className={classnames(classes.settingsText, 'ml-3')}>
            Settings
          </div>
        </Nav.Link>
      )}

      <Nav.Link href="#" className="pr-0">
        <Button
          className={classnames(classes.button, {
            'ml-4': !isMenuOpen,
            [classes.alternativeWallet]: isAlternativeWallet,
          })}
          onClick={logout}
          size="lg"
          disabled={edgeAuthLoading}
        >
          {isMetamaskWallet && (
            <img
              alt="MetaMask logo"
              src={metamaskSrc}
              className={classes.buttonIcon}
            />
          )}
          {isOperaWallet && (
            <img
              alt="Opera logo"
              src={operaSrc}
              className={classes.buttonIcon}
            />
          )}
          <p className={classes.buttonText}>
            {isAlternativeWallet ? 'Disconnect' : 'Sign Out'}{' '}
          </p>
          {(edgeAuthLoading || profileLoading) && (
            <Loader isWhite className={classes.buttonLoader} />
          )}
        </Button>
      </Nav.Link>
    </div>
  );
};
