import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ContainerProps } from './types';
import { Link } from 'react-router-dom';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';
import WalletItem from './components/WalletItem';
import CreateWallet from './components/CreateWallet';
import ActionButtonsContainer from './components/ActionButtonsContainer';
import TotalBalanceBadge from './components/TotalBalanceBadge';
import InfoBadge from '../../components/Badges/InfoBadge/InfoBadge';

import classes from './styles/WalletsPage.module.scss';
import { ROUTES } from '../../constants/routes';

const WalletsPage: React.FC<ContainerProps> = props => {
  const { fioWallets, balance, roe, refreshBalance } = props;

  const [showCreateWallet, setShowCreateWallet] = useState<boolean>(false);

  useEffect(() => {
    for (const { publicKey } of fioWallets) {
      refreshBalance(publicKey);
    }
  }, []);

  const closeCreateWallet = () => setShowCreateWallet(false);

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
