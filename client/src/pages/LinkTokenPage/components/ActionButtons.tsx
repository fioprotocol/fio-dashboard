import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ROUTES } from '../../../constants/routes';

import classes from '../styles/TokenList.module.scss';

type Props = {
  url: string;
};

const ActionButtons: React.FC<Props> = props => {
  const { url } = props;
  return (
    <div className={classes.buttonsContainer}>
      <Link to={`${url}${ROUTES.EDIT_TOKEN}`} className={classes.link}>
        <Button>
          <FontAwesomeIcon icon="pen" className={classes.icon} />
          Edit
        </Button>
      </Link>
      <Link to={`${url}${ROUTES.DELETE_TOKEN}`} className={classes.link}>
        <Button className={classes.middleButton}>
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
