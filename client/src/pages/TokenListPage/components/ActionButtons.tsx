import React from 'react';
import { Button } from 'react-bootstrap';
import { Link as RouterLink } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import Link from '../../../components/Link/Link';

import { ROUTES } from '../../../constants/routes';

import classes from '../TokenList.module.scss';

type Props = {
  search: string;
  isDisabled: boolean;
};

const ActionButtons: React.FC<Props> = props => {
  const { search, isDisabled } = props;

  return (
    <div className={classes.buttonsContainer}>
      <Link
        isDisabled={isDisabled}
        to={`${ROUTES.EDIT_TOKEN}${search}`}
        classname={classes.link}
      >
        <Button disabled={isDisabled}>
          <EditIcon className={classes.icon} />
          Edit
        </Button>
      </Link>
      <Link
        isDisabled={isDisabled}
        to={`${ROUTES.DELETE_TOKEN}${search}`}
        classname={classes.link}
      >
        <Button className={classes.middleButton} disabled={isDisabled}>
          <DeleteIcon className={classes.icon} />
          Delete Link
        </Button>
      </Link>
      <RouterLink to={`${ROUTES.ADD_TOKEN}${search}`} className={classes.link}>
        <Button>
          <AddCircleIcon className={classes.icon} />
          Add Link
        </Button>
      </RouterLink>
    </div>
  );
};

export default ActionButtons;
