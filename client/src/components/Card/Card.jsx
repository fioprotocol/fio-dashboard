import React from 'react';

import classes from './Card.module.scss';

const Card = props => {
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
