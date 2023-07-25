import React from 'react';

import classnames from 'classnames';

import classes from './ListNameTitle.module.scss';

type Props = {
  className?: string;
  title: string;
};

export const ListNameTitle: React.FC<Props> = props => {
  const { className, title } = props;
  return <h3 className={classnames(classes.title, className)}>{title}</h3>;
};
