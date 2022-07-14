import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import { Navigation } from './components/Navigation';
import { ROUTES } from '../../constants/routes';

import { MainHeaderProps } from './types';

import classes from './MainHeader.module.scss';
import { useIsAdminRoute } from '../../hooks/admin';

const MainHeader: React.FC<MainHeaderProps> = props => {
  const {
    showLoginModal,
    logout: logoutFn,
    profileRefreshed,
    isAuthenticated,
    locationState,
    refProfileLoading,
  } = props;
  const [isMenuOpen, toggleMenuOpen] = useState(false);

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

  useEffect(() => {
    if (
      profileRefreshed &&
      !isAuthenticated &&
      locationState &&
      locationState.from &&
      locationState.from.pathname
    ) {
      showLogin();
    }
  }, [locationState, showLogin, isAuthenticated, profileRefreshed]);

  const isAdmin = useIsAdminRoute();

  if (refProfileLoading) {
    return (
      <div className={classnames(classes.header)}>
        <FontAwesomeIcon icon="spinner" spin />
      </div>
    );
  }

  return (
    <div className={classnames(classes.header, isMenuOpen && classes.isOpen)}>
      {!isAdmin ? (
        <Link to={ROUTES.HOME}>
          <div className={classes.logo} onClick={closeMenu} />
        </Link>
      ) : (
        <div>
          <div
            className={classes.logo}
            onClick={() => {
              closeMenu();
              window.open(ROUTES.HOME, '_blank');
            }}
          />
        </div>
      )}
      <Navigation
        {...props}
        isMenuOpen={isMenuOpen}
        logout={logout}
        toggleMenuOpen={toggleMenuOpen}
        closeMenu={closeMenu}
        showLogin={showLogin}
      />
    </div>
  );
};

export default MainHeader;
