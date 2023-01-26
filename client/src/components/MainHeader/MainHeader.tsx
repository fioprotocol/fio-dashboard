import React, { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { MainHeaderContainer } from '../MainHeaderContainer';
import { Navigation } from './components/Navigation';

import { MainHeaderProps } from './types';

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

  const hideSiteLink = isAuthenticated;

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
      isMenuOpen={isMenuOpen}
      closeMenu={closeMenu}
      {...props}
    >
      <Navigation
        {...props}
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
