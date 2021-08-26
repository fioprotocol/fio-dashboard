import React from 'react';
import classes from './ModalUIComponent.module.scss';

type Props = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

const ModalUIComponent: React.FC<Props> = props => {
  const { children, title, subtitle } = props;
  return (
    <div className={classes.container}>
      <h4 className={classes.title}>{title}</h4>
      <p className={classes.subtitle}>{subtitle}</p>
      {children}
      <button className={classes.cancelButton}>Cancel</button>
    </div>
  );
};

export default ModalUIComponent;
