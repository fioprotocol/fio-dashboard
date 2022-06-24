import React from 'react';

import classes from '../styles/Title.module.scss';

type Props = {
  title: string | React.ReactNode;
  subtitle: string;
  children?: React.ReactNode;
};

const Title: React.FC<Props> = props => {
  const { title, subtitle, children } = props;
  return (
    <div className={classes.titleContainer}>
      <div className={classes.title}>
        {title}
        <p className={classes.subtitle}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

export default Title;
