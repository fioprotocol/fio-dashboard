import React from 'react';

import LoggedNav from './LoggedNav';

import { NavigationProps } from '../types';

export const Navigation: React.FC<NavigationProps> | null = props => {
  const {
    isAuthenticated,
    isMenuOpen,
    toggleMenuOpen,
    closeMenu,
    logout,
  } = props;

  if (isAuthenticated)
    return (
      <LoggedNav
        isMenuOpen={isMenuOpen}
        toggleMenuOpen={toggleMenuOpen}
        closeMenu={closeMenu}
        {...props}
        logout={logout}
      />
    );

  return null;
};
