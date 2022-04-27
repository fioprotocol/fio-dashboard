import React from 'react';

import classes from './LayoutContainer.module.scss';

type Props = {
  children?: React.ReactNode;
  title: string | React.ReactNode;
  onTitleClick?: () => void;
};

const LayoutContainer: React.FC<Props> = props => {
  const { children, title, onTitleClick } = props;
  return (
    <div className={classes.container}>
      <h3 className={classes.title} onClick={onTitleClick}>
        {title}
      </h3>
      {children}
    </div>
  );
};

export default LayoutContainer;
