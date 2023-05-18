import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router';
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
    isMaintenance,
  } = props;
  const [isMenuOpen, toggleMenuOpen] = useState(false);
  const history = useHistory();

  const isPreviouslyAuth = useRef(isAuthenticated);

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
    history.push('/logout=true');
  }, [closeMenu, logoutFn, history]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const isLogout = url.searchParams.get('logout');
    const isSilentLogout = isLogout === 'silent';

    if (
      isSilentLogout ||
      isMaintenance ||
      (!isAuthenticated && isPreviouslyAuth && isPreviouslyAuth.current)
    )
      return;
    if (
      profileRefreshed &&
      !isAuthenticated &&
      locationState &&
      locationState.from &&
      locationState.from.pathname &&
      !isLogout
    ) {
      showLogin();
    }
  }, [
    locationState,
    showLogin,
    isAuthenticated,
    profileRefreshed,
    isMaintenance,
  ]);

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
        isMaintenance={isMaintenance}
      />
    </MainHeaderContainer>
  );
};

export default MainHeader;
