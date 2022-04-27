import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import RegularNav from './components/RegularNav';
import LoggedNav from './components/LoggedNav';

import classes from './MainHeader.module.scss';

import { MainHeaderProps } from './types';

const MainHeader: React.FC<MainHeaderProps> = props => {
  const {
    showLoginModal,
    logout: logoutFn,
    profileRefreshed,
    isAuthenticated,
    isNotActiveUser,
    locationState,
    fioAddresses,
    refProfileLoading,
    refProfileInfo,
    homePageLink,
  } = props;
  const isRefFlow: boolean = refProfileInfo != null && !!refProfileInfo.code;
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

  if (refProfileLoading) {
    return (
      <div className={classnames(classes.header)}>
        <FontAwesomeIcon icon="spinner" spin />
      </div>
    );
  }

  return (
    <div className={classnames(classes.header, isMenuOpen && classes.isOpen)}>
      <Link to={homePageLink}>
        <div className={classes.logo} onClick={closeMenu} />
      </Link>
      {isAuthenticated ? (
        <LoggedNav
          isMenuOpen={isMenuOpen}
          toggleMenuOpen={toggleMenuOpen}
          closeMenu={closeMenu}
          showLogin={showLogin}
          hideCart={(isRefFlow && !!fioAddresses.length) || isNotActiveUser}
          hideNotifications={isRefFlow || isNotActiveUser}
          onlyAuth={isRefFlow || isNotActiveUser}
          showSiteLink={isRefFlow}
          {...props}
          logout={logout}
        />
      ) : (
        <RegularNav
          toggleMenuOpen={toggleMenuOpen}
          isMenuOpen={isMenuOpen}
          closeMenu={closeMenu}
          showLogin={showLogin}
          onlyAuth={isRefFlow || isNotActiveUser}
          hideCart={isRefFlow}
          {...props}
        />
      )}
    </div>
  );
};

export default MainHeader;
