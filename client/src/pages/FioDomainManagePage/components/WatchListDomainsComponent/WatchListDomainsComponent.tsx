import React from 'react';

import { Link } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import { UnwrapIcon } from '../../../../components/UnwrapIcon';

import { AddDomainToWatchListModal } from '../AddDomainToWatchListModal';
import { ListNameTitle } from '../ListNameTitle';

import { useContext } from './WatchListDomainsComponentContext';

import { ROUTES } from '../../../../constants/routes';

import { DomainWatchlistItem } from '../../../../types';

import classes from './WatchListDomainsComponent.module.scss';

type Props = {
  domainsWatchlistList: DomainWatchlistItem[];
  domainWatchlistLoading: boolean;
  prices: {
    costFio: string;
    costUsdc: string;
  };
  showAddDomainWatchlistModal: boolean;
  closeDomainWatchlistModal: () => void;
  domainWatchlistItemCreate: (domain: string) => void;
  onPurchaseButtonClick: (domain: string) => void;
  openDomainWatchlistModal: () => void;
};

export const WatchListDomainsComponent: React.FC<Props> = props => {
  const {
    domainsWatchlistList,
    domainWatchlistLoading,
    prices,
    showAddDomainWatchlistModal,
    closeDomainWatchlistModal,
    domainWatchlistItemCreate,
    onPurchaseButtonClick,
    openDomainWatchlistModal,
  } = props;
  const { isSmallDesktop } = useContext();

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
              onClick={openDomainWatchlistModal}
            />
          </div>
        </div>
      </div>
      <AddDomainToWatchListModal
        domainsWatchlistList={domainsWatchlistList}
        loading={domainWatchlistLoading}
        showModal={showAddDomainWatchlistModal}
        onClose={closeDomainWatchlistModal}
        prices={prices}
        domainWatchlistItemCreate={domainWatchlistItemCreate}
        onPurchaseButtonClick={onPurchaseButtonClick}
      />
    </>
  );
};
