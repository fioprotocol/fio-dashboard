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
  loading?: boolean;
  additionalElements?: React.ReactNode;
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
    loading,
    additionalElements,
  } = props;

  return (
    <>
      <div className={classes.container}>
        <h5 className={classes.title}>{title}</h5>
        <p className={classes.subtitle}>{subtitle}</p>
        <p className={classes.attentionText}>{attentionText}</p>
        <div className={classes.additional}>{additionalElements}</div>
        <ActionButton
          title={buttonText}
          onClick={onClick}
          isGreen={isGreen}
          isBlue={isBlue}
          isSmall={isSmall}
          loading={loading}
        />
        {bottomChildren}
      </div>
      {children}
    </>
  );
};

export default SecurityItem;
