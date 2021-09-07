import React from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import classes from './SecurityItem.module.scss';

type Props = {
  attentionText?: string;
  bottomChildren?: React.ReactNode;
  buttonText: string;
  isGreen?: boolean;
  isPasswordPin?: boolean;
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
    isPasswordPin,
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
        <Button
          className={classnames(
            classes.button,
            isPasswordPin && classes.passwordPin,
            isGreen && classes.green,
          )}
          onClick={onClick}
        >
          {buttonText}
        </Button>
        {bottomChildren}
      </div>
      {children}
    </>
  );
};

export default SecurityItem;
