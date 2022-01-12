import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';
import DashboardListItem from './DashboardListItem';
import ManagePageCtaBadge from '../../components/ManagePageContainer/ManagePageCtaBadge';
import InfoBadge from '../../components/Badges/InfoBadge/InfoBadge';

import {
  useFioCryptoHandles,
  useNonActiveUserRedirect,
} from '../../util/hooks';

import { FioWalletDoublet, FioCryptoHandleDoublet } from '../../types';

import classes from './DashboardPage.module.scss';
import { ROUTES } from '../../constants/routes';

type Props = {
  fioWallets: FioWalletDoublet[];
  fioCryptoHandles: FioCryptoHandleDoublet[];
  loading: boolean;
};

const DashboardPage: React.FC<Props> = props => {
  const { fioWallets, fioCryptoHandles, loading } = props;
  useFioCryptoHandles();
  useNonActiveUserRedirect();

  return (
    <div className={classes.container}>
      <LayoutContainer title="Dashboard">
        <div className={classes.listHeader}>
          <h5 className={classes.subtitle}>FIO Wallets:</h5>
          <Link to={ROUTES.TOKENS}>
            <Button className={classes.actionButton}>Manage Wallets</Button>
          </Link>
        </div>
        {loading ? (
          <FontAwesomeIcon icon="spinner" spin className={classes.spinner} />
        ) : fioWallets.length > 0 ? (
          fioWallets.map(wallet => (
            <DashboardListItem
              title={wallet.name}
              listItem={wallet.publicKey}
              key={wallet.publicKey}
            />
          ))
        ) : (
          <div className={classes.infoBadgeContainer}>
            <InfoBadge
              title="No Public Keys"
              message="You have no Public Keys for this account"
            />
          </div>
        )}
        <div className={classes.listHeader}>
          <h5 className={classes.subtitle}>FIO Crypto Handles:</h5>
          <Link to={ROUTES.FIO_ADDRESSES}>
            <Button className={classes.actionButton}>Manage Addresses</Button>
          </Link>
        </div>
        {loading ? (
          <FontAwesomeIcon icon="spinner" spin className={classes.spinner} />
        ) : fioCryptoHandles.length > 0 ? (
          fioCryptoHandles.map(fioCryptoHandle => (
            <DashboardListItem
              title="FIO Crypto Handle"
              listItem={fioCryptoHandle.name}
              key={fioCryptoHandle.name}
            />
          ))
        ) : (
          <div className={classes.infoBadgeContainer}>
            <InfoBadge
              title="No FIO Crypto Handles"
              message="You have no FIO Crypto Handles for this account"
            />
          </div>
        )}
      </LayoutContainer>
      <div className={classes.actionBadgeContainer}>
        <ManagePageCtaBadge name="address" />
        <ManagePageCtaBadge name="domain" />
      </div>
    </div>
  );
};

export default DashboardPage;
