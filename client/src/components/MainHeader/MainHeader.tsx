import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import { Navigation } from './components/Navigation';
import { MainHeaderContainer } from './components/MainHeaderContainer';

import { useIsAdminRoute } from '../../hooks/admin';

import { MainHeaderProps } from './types';

import classes from './MainHeader.module.scss';

const MainHeader: React.FC<MainHeaderProps> = props => {
  const {
    showLoginModal,
    logout: logoutFn,
    profileRefreshed,
    isAdminAuthenticated,
    isAuthenticated,
    locationState,
    refProfileLoading,
  } = props;
  const [isMenuOpen, toggleMenuOpen] = useState(false);

  const closeMenu = useCallback(() => {
    toggleMenuOpen(false);
  }, []);

  const showLogin = useCallback(() => {
    closeMenu();
    showLoginModal();
  }, [closeMenu, showLoginModal]);

  const logout = useCallback(() => {
    closeMenu();
    logoutFn();
  }, [closeMenu, logoutFn]);

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
  const hideSiteLink = isAuthenticated || isAdminAuthenticated || isAdmin;

  if (refProfileLoading) {
    return (
      <div className={classnames(classes.header)}>
        <FontAwesomeIcon icon="spinner" spin />
      </div>
    );
  }

  return (
    <MainHeaderContainer
      hideSiteLink={hideSiteLink}
      isAdmin={isAdmin}
      isMenuOpen={isMenuOpen}
      closeMenu={closeMenu}
      {...props}
    >
      <Navigation
        {...props}
        isAdminRoute={isAdmin}
        isMenuOpen={isMenuOpen}
        logout={logout}
        toggleMenuOpen={toggleMenuOpen}
        closeMenu={closeMenu}
        showLogin={showLogin}
      />
    </MainHeaderContainer>
  );
};

export default MainHeader;
