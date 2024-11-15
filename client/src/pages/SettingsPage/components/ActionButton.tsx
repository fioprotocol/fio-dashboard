import React from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import Loader from '../../../components/Loader/Loader';

import classes from '../styles/ActionButton.module.scss';

type Props = {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  title: string;
  isGreen?: boolean;
  isIndigo?: boolean;
  isSmall?: boolean;
  loading?: boolean;
};

const ActionButton: React.FC<Props> = props => {
  const {
    className,
    disabled,
    onClick,
    href,
    title,
    isGreen,
    isIndigo,
    isSmall,
    loading,
  } = props;
  return (
    <Button
      onClick={onClick}
      href={href}
      className={classnames(
        classes.button,
        isGreen && classes.isGreen,
        isIndigo && classes.isIndigo,
        isSmall && classes.isSmall,
        className,
      )}
      disabled={loading || disabled}
    >
      <p className={classes.title}>{title}</p>
      {loading && <Loader className={classes.loading} />}
    </Button>
  );
};

export default ActionButton;
