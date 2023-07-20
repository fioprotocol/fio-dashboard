import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';
import WalletItem from './components/WalletItem';
import CreateWallet from './components/CreateWallet';
import ActionButtonsContainer from './components/ActionButtonsContainer';
import TotalBalanceBadge from './components/TotalBalanceBadge';
import Title from './components/Title';
import InfoBadge from '../../components/Badges/InfoBadge/InfoBadge';
import NotificationBadge from '../../components/NotificationBadge/NotificationBadge';
import { WelcomeComponent } from '../DashboardPage/components/WelcomeComponent';

import { ROUTES } from '../../constants/routes';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import {
  NOTIFICATIONS_CONTENT,
  NOTIFICATIONS_CONTENT_TYPE,
} from '../../constants/notifications';
import { Types } from '../DashboardPage/components/WelcomeComponentItem/constants';

import useEffectOnce from '../../hooks/general';

import { Props } from './types';

import classes from './styles/WalletsPage.module.scss';
import unwrapIcon from '../../assets/images/unwrap.svg';

interface LocationState {
  walletDeleted?: boolean;
}

const AUTOCLOSE_TIME = 5000;

const WalletsPage: React.FC<Props> = props => {
  const { fioWallets, balance, refreshBalance, location } = props;

  const [showCreateWallet, setShowCreateWallet] = useState<boolean>(false);
  const [showWalletImported, setShowWalletImported] = useState<boolean>(false);
  const [showWalletCreated, setShowWalletCreated] = useState<boolean>(false);
  const [showWalletDeleted, setShowWalletDeleted] = useState<boolean>(false);

  useEffectOnce(() => {
    for (const { publicKey } of fioWallets) {
      refreshBalance(publicKey);
    }
  }, [fioWallets, refreshBalance]);

  useEffect(() => {
    if (location.query && location.query.imported) {
      setShowWalletImported(true);
    }

    if (location.state && (location.state as LocationState).walletDeleted) {
      setShowWalletDeleted(true);
    }
  }, [location]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowWalletDeleted(false);
    }, AUTOCLOSE_TIME);

    if (!showWalletDeleted) {
      clearTimeout(timeoutId);
    }

    return () => clearTimeout(timeoutId);
  }, [showWalletDeleted]);

  const closeCreateWallet = () => setShowCreateWallet(false);
  const closeImportedWallet = () => setShowWalletImported(false);
  const closeCreatedWallet = () => setShowWalletCreated(false);
  const closeDeletedWallet = () => setShowWalletDeleted(false);

  const onAdd = () => {
    setShowCreateWallet(true);
  };
  const onWalletCreated = () => {
    setShowCreateWallet(false);
    setShowWalletCreated(true);
  };

  const renderTitle = () => {
    return (
      <Title title="FIO Wallets">
        <ActionButtonsContainer>
          <Link to={ROUTES.UNWRAP_TOKENS} className={classes.actionButton}>
            <Button>
              <img
                src={unwrapIcon}
                alt="unwrap"
                className={classes.unwrapIcon}
              />
              <span>Unwrap Tokens</span>
            </Button>
          </Link>

          <Link to={ROUTES.IMPORT_WALLET} className={classes.actionButton}>
            <Button>
              <SystemUpdateAltIcon fontSize="small" />
              <span>Import</span>
            </Button>
          </Link>

          <a href="#" onClick={onAdd} className={classes.actionButton}>
            <Button>
              <FontAwesomeIcon icon="plus-circle" />
              <span>Add</span>
            </Button>
          </a>
        </ActionButtonsContainer>
      </Title>
    );
  };

  return (
    <div className={classes.container}>
      <CreateWallet
        show={showCreateWallet}
        onClose={closeCreateWallet}
        onWalletCreated={onWalletCreated}
      />
      <LayoutContainer title={renderTitle()}>
        <NotificationBadge
          type={BADGE_TYPES.INFO}
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
          hasNewDesign
          marginAuto
        />
        <NotificationBadge
          type={BADGE_TYPES.INFO}
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
          hasNewDesign
          marginAuto
        />
        <NotificationBadge
          type={BADGE_TYPES.INFO}
          show={showWalletDeleted}
          onClose={closeDeletedWallet}
          message={
            NOTIFICATIONS_CONTENT[NOTIFICATIONS_CONTENT_TYPE.WALLET_DELETED]
              .message
          }
          title={
            NOTIFICATIONS_CONTENT[NOTIFICATIONS_CONTENT_TYPE.WALLET_DELETED]
              .title
          }
          iconName="check-circle"
          hasNewDesign
          marginAuto
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
        <TotalBalanceBadge {...balance.total} isNew isMobile itTotalWallets />
        <WelcomeComponent onlyActions noPaddingTop type={Types.TOK} />
      </LayoutContainer>
      <div className={classes.totalBalanceContainer}>
        <TotalBalanceBadge {...balance.total} isNew itTotalWallets />
      </div>
    </div>
  );
};

export default WalletsPage;
