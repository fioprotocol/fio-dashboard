import React from 'react';
import { Nav } from 'react-bootstrap';

import { LoggedActionButtons } from './ActionButtons';
import SideMenu from '../../../../components/MainHeader/components/SideMenu';

import { useCheckIfDesktop } from '../../../../screenType';

import classes from '../MainHeader.module.scss';

type LoggedNavProps = {
  isMenuOpen: boolean;
  toggleMenuOpen: (openState: boolean) => void;
  profileLoading: boolean;
  logout: () => void;
  closeMenu: () => void;
};

const LoggedNav: React.FC<LoggedNavProps> = props => {
  const { isMenuOpen, toggleMenuOpen } = props;

  const isDesktop = useCheckIfDesktop();

  return (
    <div className={classes.loggedNavContainer}>
      <div />
      <Nav className="pr-0 align-items-center">
        {isDesktop ? (
          <LoggedActionButtons {...props} />
        ) : (
          <SideMenu isMenuOpen={isMenuOpen} toggleMenuOpen={toggleMenuOpen}>
            <LoggedActionButtons {...props} />
          </SideMenu>
        )}
      </Nav>
    </div>
  );
};

export default LoggedNav;
