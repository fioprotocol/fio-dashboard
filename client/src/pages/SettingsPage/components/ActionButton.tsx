import React from 'react';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import classes from '../styles/ActionButton.module.scss';

type Props = {
  onClick: () => void;
  title: string;
  isGreen?: boolean;
  isBlue?: boolean;
  isSmall?: boolean;
  loading?: boolean;
};

const ActionButton: React.FC<Props> = props => {
  const { onClick, title, isGreen, isBlue, isSmall, loading } = props;
  return (
    <Button
      onClick={onClick}
      className={classnames(
        classes.button,
        isGreen && classes.isGreen,
        isBlue && classes.isBlue,
        isSmall && classes.isSmall,
      )}
      disabled={loading}
    >
      {title}
      {loading && (
        <FontAwesomeIcon icon="spinner" spin className={classes.loading} />
      )}
    </Button>
  );
};

export default ActionButton;
