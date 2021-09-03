import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import classes from './MainHeader.module.scss';
import { MainHeaderProps } from './types';
import RegularNav from './components/RegularNav';
import LoggedNav from './components/LoggedNav';

const MainHeader: React.FC<MainHeaderProps> = props => {
  const {
    showLoginModal,
    logout: logoutFn,
    isAuthenticated,
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

  if (refProfileLoading) {
    return (
      <div className={classnames(classes.header)}>
        <FontAwesomeIcon icon="spinner" spin />
      </div>
    );
  }

  return (
    <div className={classnames(classes.header, isMenuOpen && classes.isOpen)}>
      <Link to="/">
        <div className={classes.logo} onClick={closeMenu} />
      </Link>
      {isAuthenticated ? (
        <LoggedNav
          isMenuOpen={isMenuOpen}
          toggleMenuOpen={toggleMenuOpen}
          logout={logout}
          closeMenu={closeMenu}
          showLogin={showLogin}
          {...props}
        />
      ) : (
        <RegularNav
          toggleMenuOpen={toggleMenuOpen}
          isMenuOpen={isMenuOpen}
          closeMenu={closeMenu}
          showLogin={showLogin}
          {...props}
        />
      )}
    </div>
  );
};

export default MainHeader;
