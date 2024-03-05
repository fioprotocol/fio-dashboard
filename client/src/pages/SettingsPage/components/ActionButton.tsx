import React from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import Loader from '../../../components/Loader/Loader';

import classes from '../styles/ActionButton.module.scss';

type Props = {
  disabled?: boolean;
  onClick: () => void;
  title: string;
  isGreen?: boolean;
  isIndigo?: boolean;
  isSmall?: boolean;
  loading?: boolean;
};

const ActionButton: React.FC<Props> = props => {
  const {
    disabled,
    onClick,
    title,
    isGreen,
    isIndigo,
    isSmall,
    loading,
  } = props;
  return (
    <Button
      onClick={onClick}
      className={classnames(
        classes.button,
        isGreen && classes.isGreen,
        isIndigo && classes.isIndigo,
        isSmall && classes.isSmall,
      )}
      disabled={loading || disabled}
    >
      <p className={classes.title}>{title}</p>
      {loading && <Loader className={classes.loading} />}
    </Button>
  );
};

export default ActionButton;
