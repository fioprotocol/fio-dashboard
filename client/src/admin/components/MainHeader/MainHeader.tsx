import React, { useState, useCallback } from 'react';

import { Navigation } from './components/Navigation';
import { MainHeaderContainer } from '../../../components/MainHeaderContainer';

import { MainHeaderProps } from './types';

const MainHeader: React.FC<MainHeaderProps> = props => {
  const { logout: logoutFn } = props;
  const [isMenuOpen, toggleMenuOpen] = useState(false);

  const closeMenu = useCallback(() => {
    toggleMenuOpen(false);
  }, []);

  const logout = useCallback(() => {
    closeMenu();
    logoutFn();
  }, [closeMenu, logoutFn]);

  return (
    <MainHeaderContainer
      hideSiteLink
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
      />
    </MainHeaderContainer>
  );
};

export default MainHeader;
