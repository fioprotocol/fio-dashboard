import React from 'react';

import { Link } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import { UnwrapIcon } from '../../../../components/UnwrapIcon';

import { AddDomainToWatchListModal } from '../AddDomainToWatchListModal';
import { ListNameTitle } from '../ListNameTitle';

import { useContext } from './WatchListDomainsComponentContext';

import { ROUTES } from '../../../../constants/routes';

import classes from './WatchListDomainsComponent.module.scss';

type Props = {
  prices: {
    costFio: string;
    costUsdc: string;
  };
  onPurchaseButtonClick: (domain: string) => void;
};

export const WatchListDomainsComponent: React.FC<Props> = props => {
  const { prices, onPurchaseButtonClick } = props;
  const { isSmallDesktop, showModal, closeModal, openModal } = useContext();

  return (
    <>
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
              onClick={openModal}
            />
          </div>
        </div>
      </div>
      <AddDomainToWatchListModal
        showModal={showModal}
        onClose={closeModal}
        prices={prices}
        onPurchaseButtonClick={onPurchaseButtonClick}
      />
    </>
  );
};
