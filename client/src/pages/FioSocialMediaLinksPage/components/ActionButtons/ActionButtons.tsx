import React from 'react';
import { Button } from 'react-bootstrap';
import { Link as RouterLink } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import Link from '../../../../components/Link/Link';

import { ROUTES } from '../../../../constants/routes';

import classes from './ActionButtons.module.scss';

type Props = {
  search: string;
  isDisabled: boolean;
};

export const ActionButtons: React.FC<Props> = props => {
  const { search, isDisabled } = props;

  return (
    <div className={classes.container}>
      <Link
        isDisabled={isDisabled}
        to={`${ROUTES.FIO_SOCIAL_MEDIA_LINKS_EDIT}${search}`}
        classname={classes.link}
      >
        <Button disabled={isDisabled}>
          <EditIcon className={classes.icon} />
          Edit
        </Button>
      </Link>
      <Link
        isDisabled={isDisabled}
        to={`${ROUTES.FIO_SOCIAL_MEDIA_LINKS_DELETE}${search}`}
        classname={classes.link}
      >
        <Button className={classes.middleButton} disabled={isDisabled}>
          <DeleteIcon className={classes.icon} />
          Delete
        </Button>
      </Link>
      <RouterLink
        to={`${ROUTES.FIO_SOCIAL_MEDIA_LINKS_ADD}${search}`}
        className={classes.link}
      >
        <Button>
          <AddCircleIcon className={classes.icon} />
          Add
        </Button>
      </RouterLink>
    </div>
  );
};
