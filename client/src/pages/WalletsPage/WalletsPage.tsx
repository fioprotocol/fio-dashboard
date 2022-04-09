import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';
import WalletItem from './components/WalletItem';
import CreateWallet from './components/CreateWallet';
import ActionButtonsContainer from './components/ActionButtonsContainer';
import TotalBalanceBadge from './components/TotalBalanceBadge';
import InfoBadge from '../../components/Badges/InfoBadge/InfoBadge';
import NotificationBadge from '../../components/NotificationBadge/NotificationBadge';

import { ROUTES } from '../../constants/routes';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import {
  NOTIFICATIONS_CONTENT,
  NOTIFICATIONS_CONTENT_TYPE,
} from '../../constants/notifications';

import useEffectOnce from '../../hooks/general';

import { Props } from './types';

import classes from './styles/WalletsPage.module.scss';

const WalletsPage: React.FC<Props> = props => {
  const { fioWallets, balance, refreshBalance, location } = props;

  const [showCreateWallet, setShowCreateWallet] = useState<boolean>(false);
  const [showWalletImported, setShowWalletImported] = useState<boolean>(false);
  const [showWalletCreated, setShowWalletCreated] = useState<boolean>(false);

  useEffectOnce(() => {
    for (const { publicKey } of fioWallets) {
      refreshBalance(publicKey);
    }
  }, [fioWallets, refreshBalance]);

  useEffect(() => {
    if (location.query && location.query.imported) {
      setShowWalletImported(true);
    }
  }, [location]);

  const closeCreateWallet = () => setShowCreateWallet(false);
  const closeImportedWallet = () => setShowWalletImported(false);
  const closeCreatedWallet = () => setShowWalletCreated(false);

  const onAdd = () => {
    setShowCreateWallet(true);
  };
  const onWalletCreated = () => {
    setShowCreateWallet(false);
    setShowWalletCreated(true);
  };

  return (
    <div className={classes.container}>
      <CreateWallet
        show={showCreateWallet}
        onClose={closeCreateWallet}
        onWalletCreated={onWalletCreated}
      />
      <LayoutContainer title="FIO Wallets">
        <ActionButtonsContainer>
          <Link to={ROUTES.IMPORT_WALLET} className={classes.link}>
            <div>
              <FontAwesomeIcon icon="download" />
            </div>
          </Link>
          <div onClick={onAdd}>
            <FontAwesomeIcon icon="plus-circle" />
          </div>
        </ActionButtonsContainer>
        <p className={classes.subtitle}>Manage your wallets</p>
        <NotificationBadge
          type={BADGE_TYPES.SUCCESS}
          show={showWalletImported}
          onClose={closeImportedWallet}
          message={
            NOTIFICATIONS_CONTENT[NOTIFICATIONS_CONTENT_TYPE.WALLET_IMPORTED]
              .message
          }
          title={
            NOTIFICATIONS_CONTENT[NOTIFICATIONS_CONTENT_TYPE.WALLET_IMPORTED]
              .title
          }
          iconName="check-circle"
        />
        <NotificationBadge
          type={BADGE_TYPES.SUCCESS}
          show={showWalletCreated}
          onClose={closeCreatedWallet}
          message={
            NOTIFICATIONS_CONTENT[NOTIFICATIONS_CONTENT_TYPE.WALLET_CREATED]
              .message
          }
          title={
            NOTIFICATIONS_CONTENT[NOTIFICATIONS_CONTENT_TYPE.WALLET_CREATED]
              .title
          }
          iconName="check-circle"
        />
        {fioWallets.length > 0 ? (
          fioWallets.map(wallet => (
            <WalletItem key={wallet.publicKey} fioWallet={wallet} />
          ))
        ) : (
          <div className={classes.infoBadge}>
            <InfoBadge
              title="No Wallets"
              message="You have no wallets at this time."
            />
          </div>
        )}
      </LayoutContainer>
      <div className={classes.totalBalanceContainer}>
        <TotalBalanceBadge {...balance.total} />
      </div>
    </div>
  );
};

export default WalletsPage;
