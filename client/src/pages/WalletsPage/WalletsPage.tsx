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

import { Props } from './types';

import classes from './styles/WalletsPage.module.scss';

const WalletsPage: React.FC<Props> = props => {
  const { fioWallets, balance, roe, refreshBalance, location } = props;

  const [showCreateWallet, setShowCreateWallet] = useState<boolean>(false);
  const [showWalletImported, setShowWalletImported] = useState<boolean>(false);

  useEffect(() => {
    for (const { publicKey } of fioWallets) {
      refreshBalance(publicKey);
    }
  }, []);

  useEffect(() => {
    if (location.query && location.query.imported) {
      setShowWalletImported(true);
    }
  }, [location]);

  const closeCreateWallet = () => setShowCreateWallet(false);
  const closeImportedWallet = () => setShowWalletImported(false);

  const onAdd = () => {
    setShowCreateWallet(true);
  };
  const onWalletCreated = () => {
    setShowCreateWallet(false);
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
        {showWalletImported ? (
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
        ) : null}
        {fioWallets.length > 0 ? (
          fioWallets.map(wallet => (
            <WalletItem key={wallet.publicKey} fioWallet={wallet} roe={roe} />
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
