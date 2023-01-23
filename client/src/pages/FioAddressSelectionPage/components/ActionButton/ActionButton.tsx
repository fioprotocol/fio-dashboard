import React from 'react';

import { Button } from 'react-bootstrap';
import AddBox from '@mui/icons-material/AddBox';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import { ROUTES } from '../../../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../../../constants/queryParams';

import classes from './ActionButton.module.scss';

type Props = {
  addressValue: string;
  hasSquareShape?: boolean;
  shouldPrependUserDomains?: boolean;
  text: string;
};

export const ActionButton: React.FC<Props> = props => {
  const {
    addressValue,
    hasSquareShape,
    shouldPrependUserDomains,
    text,
  } = props;

  return (
    <Link
      to={{
        pathname: ROUTES.FIO_ADDRESS_CUSTOM_SELECTION,
        search: `${QUERY_PARAMS_NAMES.ADDRESS}=${addressValue}`,
        state: { shouldPrependUserDomains },
      }}
    >
      <Button
        className={classnames(
          classes.button,
          hasSquareShape && classes.hasSquareShape,
        )}
      >
        <AddBox className={classes.icon} />
        <p className={classes.text}>{text}</p>
      </Button>
    </Link>
  );
};
