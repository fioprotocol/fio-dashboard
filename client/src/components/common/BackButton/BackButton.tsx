import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import classes from './BackButton.module.scss';

type Props = {
  link: string;
};

const BackButton: React.FC<Props> = props => {
  const { link } = props;
  return (
    <Link to={link}>
      <FontAwesomeIcon icon="arrow-left" className={classes.arrow} />
    </Link>
  );
};

export default BackButton;
