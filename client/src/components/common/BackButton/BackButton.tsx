import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import classes from './BackButton.module.scss';

type Props = {
  link: string;
  onClick?: () => void;
};

const BackButton: React.FC<Props> = props => {
  const { link, onClick } = props;

  if (onClick != null) {
    return (
      <FontAwesomeIcon
        icon="arrow-left"
        className={classes.arrow}
        onClick={onClick}
      />
    );
  }

  return (
    <Link to={link}>
      <FontAwesomeIcon icon="arrow-left" className={classes.arrow} />
    </Link>
  );
};

export default BackButton;
