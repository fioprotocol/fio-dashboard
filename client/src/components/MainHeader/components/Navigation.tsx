import React from 'react';

import RegularNav from './RegularNav';
import LoggedNav from './LoggedNav';

import { NavigationProps } from '../types';

export const Navigation: React.FC<NavigationProps> | null = props => {
  const {
    isAdminRoute,
    isAuthenticated,
    isAdminAuthenticated,
    isMenuOpen,
    isContainedFlow,
    isNotActiveUser,
    fioAddresses,
    toggleMenuOpen,
    closeMenu,
    showLogin,
    logout,
  } = props;

  if (isAuthenticated || isAdminAuthenticated)
    return (
      <LoggedNav
        isMenuOpen={isMenuOpen}
        toggleMenuOpen={toggleMenuOpen}
        closeMenu={closeMenu}
        showLogin={showLogin}
        hideCart={
          (isContainedFlow && !!fioAddresses.length) ||
          isNotActiveUser ||
          isAdminRoute
        }
        hideOrder={isContainedFlow || isNotActiveUser || isAdminRoute}
        hideNotifications={isContainedFlow || isNotActiveUser || isAdminRoute}
        onlyAuth={isContainedFlow || isNotActiveUser}
        hideSettings={isAdminRoute}
        showSiteLink={isContainedFlow}
        {...props}
        logout={logout}
      />
    );

  if (!isAdminRoute)
    return (
      <RegularNav
        toggleMenuOpen={toggleMenuOpen}
        isMenuOpen={isMenuOpen}
        closeMenu={closeMenu}
        showLogin={showLogin}
        onlyAuth={isContainedFlow || isNotActiveUser}
        hideCart={isContainedFlow}
        {...props}
      />
    );

  return null;
};
