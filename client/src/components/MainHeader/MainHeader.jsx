import React, { useState } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Link } from 'react-router-dom';
import { Button, Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { currentScreenType } from '../../screenType';
import { SCREEN_TYPE } from '../../constants/screen';
import Menu from '../Menu';

import { ROUTES } from '../../constants/routes';
import classes from './MainHeader.module.scss';

const MainHeader = props => {
  const {
    showLoginModal,
    logout: logoutFn,
    account,
    loading,
    notifications,
  } = props;
  const [isMenuOpen, toggleMenuOpen] = useState(false);

  const isDesktop = () => {
    const { screenType } = currentScreenType();
    return screenType === SCREEN_TYPE.DESKTOP;
  };

  const closeMenu = () => {
    toggleMenuOpen(false);
  };

  const showLogin = () => {
    closeMenu();
    showLoginModal();
  };

  const logout = () => {
    closeMenu();
    logoutFn(account);
  };

  const renderLoggedMenu = () => {
    return (
      <Nav className="pr-0 align-items-center">
        <Nav.Link className={classnames(classes.navItem, 'text-white')}>
          <div className={classnames(classes.notifWrapper, classes.cartanim)}>
            <FontAwesomeIcon
              icon="shopping-cart"
              className={classnames(classes.icon)}
            />
            <div
              className={classnames(
                classes.notifActiveWrapper,
                classes.notifActiveWrapperRight,
              )}
            >
              <FontAwesomeIcon
                icon="circle"
                className={classnames(classes.notifActive, 'text-success')}
              />
            </div>
          </div>
        </Nav.Link>
        <hr className={classnames(classes.vertical, 'mx-3')} />
        <Nav.Link
          href="#"
          className={classnames(classes.navItem, 'text-white')}
        >
          <div className={classnames(classes.notifWrapper, classes.bellshake)}>
            <FontAwesomeIcon
              icon="bell"
              className={classnames(
                classes.icon,
                classes.notification,
                'text-white',
              )}
            />
            {!!notifications.length && (
              <div className={classes.notifActiveWrapper}>
                <FontAwesomeIcon
                  icon="circle"
                  className={classnames(
                    classes.notifActive,
                    'mr-2',
                    'text-danger',
                  )}
                />
              </div>
            )}
          </div>
          {isDesktop() && <div className="ml-3">Notifications</div>}
        </Nav.Link>
        <hr className={classnames(classes.vertical, 'mx-3')} />
        <Nav.Link
          href="#"
          className={classnames(classes.navItem, 'text-white')}
        >
          <div className={classnames(classes.settings)}>
            <FontAwesomeIcon
              icon="cog"
              className={classnames(classes.settingsIcon)}
            />
          </div>
          {isDesktop() && <div className="ml-3">Settings</div>}
        </Nav.Link>
        <Nav.Link href="#" className="pr-0">
          <Button
            className={classnames(classes.button, 'ml-4')}
            onClick={logout}
            size="lg"
            disabled={loading}
          >
            Sign Out {loading && <FontAwesomeIcon icon="spinner" spin />}
          </Button>
        </Nav.Link>
      </Nav>
    );
  };

  const renderActionButtons = () => {
    return (
      <div
        className={classnames(
          classes.actionContainer,
          isMenuOpen && classes.isOpen,
        )}
      >
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
        <Nav.Link className="pr-0">
          <Button
            className={classes.button}
            size="lg"
            onClick={showLogin}
            disabled={loading}
          >
            Sign In {loading && <FontAwesomeIcon icon="spinner" spin />}
          </Button>
        </Nav.Link>
      </div>
    );
  };

  const renderRegularNav = () => {
    return (
      <div className={classes.regularNavContainer}>
        <div className={classes.link}>
          <a
            href="https://fioprotocol.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
          >
            <FontAwesomeIcon
              icon="arrow-left"
              className={classnames(classes.arrow, 'mr-2', 'text-white')}
            />
            Go to fioprotocol.io
          </a>
        </div>
        <Navbar className="pr-0">
          <Nav className="mr-auto align-items-center">
            <Nav.Link className={classnames(classes.navItem, 'text-white')}>
              <div
                className={classnames(classes.notifWrapper, classes.cartanim)}
              >
                <FontAwesomeIcon
                  icon="shopping-cart"
                  className={classnames(classes.icon, 'mr-4')}
                />
                <div
                  className={classnames(
                    classes.notifActiveWrapper,
                    classes.notifActiveWrapperRight,
                  )}
                >
                  <FontAwesomeIcon
                    icon="circle"
                    className={classnames(
                      classes.notifActive,
                      'text-success',
                      'mr-2',
                    )}
                  />
                </div>
              </div>
            </Nav.Link>
            {isDesktop() ? (
              renderActionButtons()
            ) : (
              <>
                <div
                  className={classnames(
                    classes.menuIcon,
                    isMenuOpen && classes.isOpen,
                  )}
                  onClick={() => toggleMenuOpen(!isMenuOpen)}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <Menu isOpen={isMenuOpen}>{renderActionButtons()}</Menu>
              </>
            )}
          </Nav>
        </Navbar>
      </div>
    );
  };

  return (
    <div className={classnames(classes.header, isMenuOpen && classes.isOpen)}>
      <Link to="/">
        <div className={classes.logo} onClick={closeMenu} />
      </Link>
      {account ? renderLoggedMenu() : renderRegularNav()}
    </div>
  );
};

MainHeader.propTypes = exact({
  account: PropTypes.object,
  pathname: PropTypes.string.isRequired,
  user: PropTypes.object,
  edgeContextSet: PropTypes.bool,
  loading: PropTypes.bool,
  logout: PropTypes.func.isRequired,
  showLoginModal: PropTypes.func.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.object),
});

export default MainHeader;
