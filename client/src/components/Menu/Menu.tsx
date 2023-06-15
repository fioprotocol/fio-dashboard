import React from 'react';
import classnames from 'classnames';

import classes from './Menu.module.scss';

type Props = {
  children: React.ReactNode | React.ReactNode[];
  isOpen?: boolean;
  classNames?: string;
};

const Menu: React.FC<Props> = props => {
  const { children, classNames, isOpen } = props;
  return (
    <div
      className={classnames(
        classes.container,
        isOpen && classes.isOpen,
        classNames,
      )}
    >
      <div className={classes.menu}>{children}</div>
    </div>
  );
};

export default Menu;
