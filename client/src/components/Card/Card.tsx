import React from 'react';

import classes from './Card.module.scss';

type Props = {
  children: React.ReactNode | React.ReactNode[];
  title: string;
  subtitle: string;
};

const Card: React.FC<Props> = props => {
  const { children, title, subtitle } = props;

  return (
    <div className={classes.container}>
      <h3 className={classes.title}>{title}</h3>
      <p className={classes.subtitle}>{subtitle}</p>
      {children}
    </div>
  );
};

export default Card;
