import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import classes from './BackButton.module.scss';

type Props = {
  classNames?: string;
  hide?: boolean;
  isWhite?: boolean;
  link?: string;
  text?: string;
  onClick?: () => void;
};

const BackButton: React.FC<Props> = props => {
  const { classNames, hide, isWhite, link, text, onClick } = props;

  if (hide) return null;

  if (onClick != null) {
    return (
      <div className={classes.container}>
        <ArrowBackIcon
          className={classnames(
            classes.arrow,
            isWhite && classes.isWhite,
            classNames,
          )}
          onClick={onClick}
        />
        {text && <p>{text}</p>}
      </div>
    );
  }

  return (
    <Link to={link} className={classnames(classes.container, classNames)}>
      <ArrowBackIcon
        className={classnames(classes.arrow, isWhite && classes.isWhite)}
      />
      {text && <p>{text}</p>}
    </Link>
  );
};

export default BackButton;
