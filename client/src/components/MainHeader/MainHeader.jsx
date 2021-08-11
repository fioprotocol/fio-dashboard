import React, { useState } from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';
import { Link } from 'react-router-dom';
import { Button, Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { useCheckIfDesktop } from '../../screenType';
import Menu from '../Menu';
import Navigation from '../Navigation/Navigation';

import { ROUTES } from '../../constants/routes';
import classes from './MainHeader.module.scss';

const MainHeader = props => {
  const {
    showLoginModal,
    logout: logoutFn,
    isAuthenticated,
    profileLoading,
    edgeAuthLoading,
    notifications,
    cartItems,
  } = props;
  const [isMenuOpen, toggleMenuOpen] = useState(false);

  const isDesktop = useCheckIfDesktop();

  const closeMenu = () => {
    toggleMenuOpen(false);
  };

  const showLogin = () => {
    closeMenu();
    showLoginModal();
  };

  const logout = () => {
    closeMenu();
    logoutFn();
  };

  const renderSideMenu = children => {
    return (
      <>
        <div
          className={classnames(classes.menuIcon, isMenuOpen && classes.isOpen)}
          onClick={() => toggleMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <Menu isOpen={isMenuOpen}>{children}</Menu>
      </>
    );
  };

  const renderLoggedActionButtons = () => {
    return (
      <div
        className={classnames(
          classes.loggedActionButtons,
          isMenuOpen && classes.isOpen,
        )}
      >
        {isMenuOpen && (
          <Navigation isOnSide={isMenuOpen} closeMenu={closeMenu} />
        )}
        {isMenuOpen && <hr className={classes.horizontal} />}
        <Nav.Link
          href="#"
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

  const renderLoggedMenu = () => {
    return (
      <Nav className="pr-0 align-items-center">
        <Nav.Link
          className={classnames(classes.navItem, 'text-white')}
          onClick={closeMenu}
          as={Link}
          to={
            cartItems.length > 0 ? ROUTES.CART : ROUTES.FIO_ADDRESSES_SELECTION
          }
        >
          <div className={classnames(classes.notifWrapper, classes.cartanim)}>
            <FontAwesomeIcon
              icon="shopping-cart"
              className={classnames(classes.icon)}
            />
            {cartItems.length > 0 && (
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
            )}
          </div>
        </Nav.Link>
        <hr className={classnames(classes.vertical, 'mx-3')} />
        <Nav.Link
          href="#"
          className={classnames(classes.navItem, 'text-white')}
          onClick={closeMenu}
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
          {isDesktop && <div className="ml-3">Notifications</div>}
        </Nav.Link>
        {isDesktop ? (
          <hr className={classnames(classes.vertical, 'mx-3')} />
        ) : (
          <div className="mx-3" />
        )}
        {isDesktop
          ? renderLoggedActionButtons()
          : renderSideMenu(renderLoggedActionButtons())}
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
            <Nav.Link
              className={classnames(classes.navItem, 'text-white')}
              as={Link}
              to={
                cartItems.length > 0
                  ? ROUTES.CART
                  : ROUTES.FIO_ADDRESSES_SELECTION
              }
            >
              <div
                className={classnames(classes.notifWrapper, classes.cartanim)}
              >
                <FontAwesomeIcon
                  icon="shopping-cart"
                  className={classnames(classes.icon, 'mr-4')}
                />
                {cartItems.length > 0 && (
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
                )}
              </div>
            </Nav.Link>
            {isDesktop
              ? renderActionButtons()
              : renderSideMenu(renderActionButtons())}
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
      {isAuthenticated ? renderLoggedMenu() : renderRegularNav()}
    </div>
  );
};

MainHeader.propTypes = exact({
  isAuthenticated: PropTypes.bool,
  pathname: PropTypes.string.isRequired,
  user: PropTypes.object,
  history: PropTypes.object,
  edgeContextSet: PropTypes.bool,
  profileLoading: PropTypes.bool,
  edgeAuthLoading: PropTypes.bool,
  logout: PropTypes.func.isRequired,
  showLoginModal: PropTypes.func.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.object),
  cartItems: PropTypes.arrayOf(PropTypes.object),
  location: PropTypes.object,
  match: PropTypes.object,
  staticContext: PropTypes.object,
});

export default MainHeader;
