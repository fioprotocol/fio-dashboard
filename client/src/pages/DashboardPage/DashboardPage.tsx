import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';
import DashboardListItem from './DashboardListItem';
import ManagePageCtaBadge from '../../components/ManagePageContainer/ManagePageCtaBadge';
import InfoBadge from '../../components/Badges/InfoBadge/InfoBadge';

import { useFioAddresses, useNonActiveUserRedirect } from '../../util/hooks';

import { FioWalletDoublet, FioAddressDoublet } from '../../types';

import classes from './DashboardPage.module.scss';
import { ROUTES } from '../../constants/routes';

type Props = {
  fioWallets: FioWalletDoublet[];
  fioAddresses: FioAddressDoublet[];
  loading: boolean;
};

const DashboardPage: React.FC<Props> = props => {
  const { fioWallets, fioAddresses, loading } = props;
  useFioAddresses();
  useNonActiveUserRedirect();

  return (
    <div className={classes.container}>
      <LayoutContainer title="Dashboard">
        <h5 className={classes.subtitle}>FIO Wallets:</h5>
        {loading ? (
          <FontAwesomeIcon icon="spinner" spin className={classes.spinner} />
        ) : fioWallets.length > 0 ? (
          fioWallets.map(wallet => (
            <DashboardListItem
              title="Wallet Public Key"
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
        <div className={classes.addressesHeader}>
          <h5 className={classes.subtitle}>FIO Addresses:</h5>
          <Link to={ROUTES.FIO_ADDRESSES}>
            <Button className={classes.actionButton}>Manage Addresses</Button>
          </Link>
        </div>
        {loading ? (
          <FontAwesomeIcon icon="spinner" spin className={classes.spinner} />
        ) : fioAddresses.length > 0 ? (
          fioAddresses.map(address => (
            <DashboardListItem
              title="Address"
              listItem={address.name}
              key={address.name}
            />
          ))
        ) : (
          <div className={classes.infoBadgeContainer}>
            <InfoBadge
              title="No FIO Addresses"
              message="You have no FIO Addresses for this account"
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
