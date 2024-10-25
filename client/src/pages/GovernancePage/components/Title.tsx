import React from 'react';

import classes from '../styles/Title.module.scss';

type Props = {
  title: string | React.ReactNode;
  subtitle?: string;
};

const Title: React.FC<Props> = props => {
  const { title, subtitle } = props;

  return (
    <div className={classes.container}>
      {title && <h3 className={classes.title}>{title}</h3>}
      {subtitle && <p className={classes.subtitle}>{subtitle}</p>}
    </div>
  );
};

export default Title;
