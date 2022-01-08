import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import { ROUTES } from '../../../constants/routes';

import classes from '../styles/TokenList.module.scss';

type Props = {
  url: string;
  isDisabled: boolean;
};

const ActionButtons: React.FC<Props> = props => {
  const { url, isDisabled } = props;
  return (
    <div className={classes.buttonsContainer}>
      <Link
        to={`${url}${ROUTES.EDIT_TOKEN}`}
        className={classnames(classes.link, isDisabled && classes.disabled)}
      >
        <Button disabled={isDisabled}>
          <FontAwesomeIcon icon="pen" className={classes.icon} />
          Edit
        </Button>
      </Link>
      <Link
        to={`${url}${ROUTES.DELETE_TOKEN}`}
        className={classnames(classes.link, isDisabled && classes.disabled)}
      >
        <Button className={classes.middleButton} disabled={isDisabled}>
          <FontAwesomeIcon icon="trash" className={classes.icon} />
          Delete Link
        </Button>
      </Link>
      <Link to={`${url}${ROUTES.ADD_TOKEN}`} className={classes.link}>
        <Button>
          <FontAwesomeIcon icon="plus-circle" className={classes.icon} />
          Add Link
        </Button>
      </Link>
    </div>
  );
};

export default ActionButtons;
