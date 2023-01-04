import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MainHeaderContainer } from '../MainHeaderContainer';
import { Navigation } from './components/Navigation';

import { useIsAdminRoute } from '../../hooks/admin';

import { MainHeaderProps } from './types';

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
      <MainHeaderContainer>
        <FontAwesomeIcon icon="spinner" spin />
      </MainHeaderContainer>
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
