import React from 'react';
import classnames from 'classnames';

import Menu from '../../../Menu';

import classes from './SideMenu.module.scss';

type SideMenuProps = {
  children: React.ReactNode;
  isMenuOpen: boolean;
  menuClassNames?: string;
  toggleMenuOpen: (openState: boolean) => void;
};

export const SideMenu: React.FC<SideMenuProps> = props => {
  const { children, isMenuOpen, menuClassNames, toggleMenuOpen } = props;
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
      <Menu isOpen={isMenuOpen} classNames={menuClassNames}>
        {children}
      </Menu>
    </>
  );
};
