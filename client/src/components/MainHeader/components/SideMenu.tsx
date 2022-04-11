import React from 'react';
import classnames from 'classnames';

import Menu from '../../Menu';

import classes from '../MainHeader.module.scss';

type SideMenuProps = {
  children: React.ReactNode;
  isMenuOpen: boolean;
  toggleMenuOpen: (openState: boolean) => void;
};
const SideMenu: React.FC<SideMenuProps> = props => {
  const { children, isMenuOpen, toggleMenuOpen } = props;
  return (
    <>
      <div
        className={classnames(classes.menuIcon, isMenuOpen && classes.isOpen)}
        onClick={() => toggleMenuOpen(!isMenuOpen)}
      >
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <Menu isOpen={isMenuOpen}>{children}</Menu>
    </>
  );
};

export default SideMenu;
