import React from 'react';
import classnames from 'classnames';
import classes from './Menu.module.scss';

const Menu = props => {
  const { children, isOpen } = props;
  return (
    <div className={classnames(classes.container, isOpen && classes.isOpen)}>
      <div className={classes.menu}>{children}</div>
    </div>
  );
};

export default Menu;
