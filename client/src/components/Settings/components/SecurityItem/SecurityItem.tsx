import React from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import classes from './SecurityItem.module.scss';

type Props = {
  attentionText?: string;
  buttonText: string;
  isPasswordPin?: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  subtitle: string;
  title: string;
};

const SecurityItem: React.FC<Props> = props => {
  const {
    attentionText,
    buttonText,
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
          )}
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </div>
      {children}
    </>
  );
};

export default SecurityItem;
