import React from 'react';

import { Link } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import { UnwrapIcon } from '../../../../components/UnwrapIcon';

import { ListNameTitle } from '../ListNameTitle';

import { useCheckIfSmallDesktop } from '../../../../screenType';

import { ROUTES } from '../../../../constants/routes';

import classes from './WatchListDomainsComponent.module.scss';

type Props = {};

export const WatchListDomainsComponent: React.FC<Props> = props => {
  const isSmallDesktop = useCheckIfSmallDesktop();

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <ListNameTitle title="Domain Watchlist" className={classes.title} />
        <div className={classes.actionButtons}>
          <Link to={ROUTES.UNWRAP_DOMAIN}>
            <SubmitButton
              hasAutoWidth
              withoutMargin
              hasNoSidePaddings
              className={classes.button}
              title="Unwrap"
              text={
                <>
                  <UnwrapIcon />
                  {!isSmallDesktop && 'Unwrap Domain'}
                </>
              }
            />
          </Link>
          <SubmitButton
            hasAutoWidth
            withoutMargin
            hasNoSidePaddings
            className={classes.button}
            title="Add to Watchlist"
            text={
              <>
                <AddCircleIcon />
                {!isSmallDesktop && 'Add to Watchlist'}
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};
