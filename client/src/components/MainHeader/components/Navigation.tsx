import React from 'react';

import { LoggedNav } from './LoggedNav';
import { RegularNav } from './RegularNav';

import { NavigationProps } from '../types';

export const Navigation: React.FC<NavigationProps> | null = props => {
  const {
    isAuthenticated,
    isMenuOpen,
    isContainedFlow,
    isNotActiveUser,
    fioAddresses,
    toggleMenuOpen,
    closeMenu,
    showLogin,
    isMetaMask,
  } = props;

  const isAlternativeEthereumWalletSetup = isMetaMask;

  if (isAuthenticated)
    return (
      <LoggedNav
        isMenuOpen={isMenuOpen}
        toggleMenuOpen={toggleMenuOpen}
        closeMenu={closeMenu}
        showLogin={showLogin}
        hideCart={(isContainedFlow && !!fioAddresses.length) || isNotActiveUser}
        hideOrder={isContainedFlow || isNotActiveUser}
        hideNotifications={isContainedFlow || isNotActiveUser}
        onlyAuth={isContainedFlow || isNotActiveUser}
        showSiteLink={isContainedFlow}
        {...props}
      />
    );

  return (
    <RegularNav
      toggleMenuOpen={toggleMenuOpen}
      isMenuOpen={isMenuOpen}
      closeMenu={closeMenu}
      showLogin={showLogin}
      onlyAuth={
        isContainedFlow || isNotActiveUser || isAlternativeEthereumWalletSetup
      }
      hideCart={isContainedFlow}
      {...props}
    />
  );
};
