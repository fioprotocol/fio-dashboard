import React from 'react';
import { Button, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import Navigation from '../../Navigation';
import Search from './Search';

import classes from '../MainHeader.module.scss';

type ActionButtonsProps = {
  profileLoading: boolean;
  isMenuOpen: boolean;
  closeMenu: () => void;
};

type LoggedActionButtonsProps = ActionButtonsProps & {
  logout: () => void;
};

export const LoggedActionButtons: React.FC<LoggedActionButtonsProps> = props => {
  const { logout, profileLoading, isMenuOpen, closeMenu } = props;

  return (
    <div
      className={classnames(
        classes.loggedActionButtons,
        isMenuOpen && classes.isOpen,
      )}
    >
      {isMenuOpen && <Navigation isOnSide={isMenuOpen} closeMenu={closeMenu} />}
      {isMenuOpen && <hr className={classes.horizontal} />}

      <Search />

      <Nav.Link href="#" className="pr-0">
        <Button
          className={classnames(classes.button, !isMenuOpen && 'ml-4')}
          onClick={logout}
          size="lg"
        >
          Sign Out {profileLoading && <FontAwesomeIcon icon="spinner" spin />}
        </Button>
      </Nav.Link>
    </div>
  );
};
