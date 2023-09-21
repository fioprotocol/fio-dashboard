import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import classes from './BackButton.module.scss';

type Props = {
  hide?: boolean;
  isWhite?: boolean;
  link?: string;
  onClick?: () => void;
};

const BackButton: React.FC<Props> = props => {
  const { hide, isWhite, link, onClick } = props;

  if (hide) return null;

  if (onClick != null) {
    return (
      <ArrowBackIcon
        className={classnames(classes.arrow, isWhite && classes.isWhite)}
        onClick={onClick}
      />
    );
  }

  return (
    <Link to={link}>
      <ArrowBackIcon
        className={classnames(classes.arrow, isWhite && classes.isWhite)}
      />
    </Link>
  );
};

export default BackButton;
