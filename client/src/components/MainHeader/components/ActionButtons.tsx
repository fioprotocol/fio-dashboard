import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import { ROUTES } from '../../../constants/routes';
import classes from '../MainHeader.module.scss';
import Navigation from '../../Navigation';

type ActionButtonsProps = {
  edgeAuthLoading: boolean;
  profileLoading: boolean;
  isMenuOpen: boolean;
  isRefFlow: boolean;
  showLogin: () => void;
  closeMenu: () => void;
};

type LoggedActionButtonsProps = ActionButtonsProps & {
  logout: () => void;
};

export const ActionButtons = (props: ActionButtonsProps) => {
  const {
    showLogin,
    edgeAuthLoading,
    profileLoading,
    isMenuOpen,
    closeMenu,
    isRefFlow,
  } = props;
  return (
    <div
      className={classnames(
        classes.actionContainer,
        isMenuOpen && classes.isOpen,
      )}
    >
      {isRefFlow ? null : (
        <Nav.Link as={Link} to={ROUTES.CREATE_ACCOUNT}>
          <Button
            variant="outline-primary"
            className={classnames(classes.button, 'text-white', 'mr-3')}
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
          Sign In{' '}
          {(edgeAuthLoading || profileLoading) && (
            <FontAwesomeIcon icon="spinner" spin />
          )}
        </Button>
      </Nav.Link>
    </div>
  );
};
export const LoggedActionButtons = (props: LoggedActionButtonsProps) => {
  const {
    logout,
    edgeAuthLoading,
    profileLoading,
    isMenuOpen,
    isRefFlow,
    closeMenu,
  } = props;

  if (isRefFlow) {
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
            Sign Out{' '}
            {(edgeAuthLoading || profileLoading) && (
              <FontAwesomeIcon icon="spinner" spin />
            )}
          </Button>
        </Nav.Link>
      </div>
    );
  }

  return (
    <div
      className={classnames(
        classes.loggedActionButtons,
        isMenuOpen && classes.isOpen,
      )}
    >
      {/* @ts-ignore */}
      {isMenuOpen && <Navigation isOnSide={isMenuOpen} closeMenu={closeMenu} />}
      {isMenuOpen && <hr className={classes.horizontal} />}
      <Nav.Link
        as={Link}
        to={ROUTES.SETTINGS}
        className={classnames(classes.navItem, 'text-white')}
        onClick={closeMenu}
      >
        <div className={classnames(classes.settings)}>
          <FontAwesomeIcon
            icon="cog"
            className={classnames(classes.settingsIcon)}
          />
        </div>
        <div className="ml-3">Settings</div>
      </Nav.Link>
      <Nav.Link href="#" className="pr-0">
        <Button
          className={classnames(classes.button, !isMenuOpen && 'ml-4')}
          onClick={logout}
          size="lg"
          disabled={edgeAuthLoading}
        >
          Sign Out{' '}
          {(edgeAuthLoading || profileLoading) && (
            <FontAwesomeIcon icon="spinner" spin />
          )}
        </Button>
      </Nav.Link>
    </div>
  );
};
