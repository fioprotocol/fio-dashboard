import React, { ReactNode } from 'react';

import classnames from 'classnames';

import classes from './ListNameTitle.module.scss';

type Props = {
  className?: string;
  title: string;
  action?: ReactNode;
};

export const ListNameTitle: React.FC<Props> = props => {
  const { className, title, action } = props;
  return (
    <div className={classnames(classes.listTitle, className)}>
      <h3 className={classes.title}>{title}</h3>
      {action}
    </div>
  );
};
