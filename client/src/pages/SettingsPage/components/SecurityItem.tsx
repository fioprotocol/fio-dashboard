import React from 'react';

import ActionButton from './ActionButton';

import classes from '../styles/SecurityItem.module.scss';

type Props = {
  attentionText?: string;
  bottomChildren?: React.ReactNode;
  buttonText: string;
  isGreen?: boolean;
  isBlue?: boolean;
  isSmall?: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  subtitle: string;
  title: string;
};

const SecurityItem: React.FC<Props> = props => {
  const {
    attentionText,
    bottomChildren,
    buttonText,
    isGreen,
    isBlue,
    isSmall,
    onClick,
    children,
    title,
    subtitle,
  } = props;

  return (
    <>
      <div className={classes.container}>
        <h5 className={classes.title}>{title}</h5>
        <p className={classes.subtitle}>{subtitle}</p>
        <p className={classes.attentionText}>{attentionText}</p>
        <ActionButton
          title={buttonText}
          onClick={onClick}
          isGreen={isGreen}
          isBlue={isBlue}
          isSmall={isSmall}
        />
        {bottomChildren}
      </div>
      {children}
    </>
  );
};

export default SecurityItem;
