import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import ReplayIcon from '@mui/icons-material/Replay';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';
import WalletItem from './components/WalletItem';
import { CreateWallet } from './components/CreateWallet';
import ActionButtonsContainer from './components/ActionButtonsContainer';
import TotalBalanceBadge from './components/TotalBalanceBadge';
import Title from './components/Title';
import InfoBadge from '../../components/Badges/InfoBadge/InfoBadge';
import NotificationBadge from '../../components/NotificationBadge/NotificationBadge';
import { WelcomeComponent } from '../../components/WelcomeComponent';

import { ROUTES } from '../../constants/routes';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import {
  NOTIFICATIONS_CONTENT,
  NOTIFICATIONS_CONTENT_TYPE,
} from '../../constants/notifications';

import { useContext } from './WalletsPageContext';

import { Props } from './types';

import classes from './styles/WalletsPage.module.scss';

type TitleComponentProps = {
  isAlternativeAccountType: boolean;
  onAdd: () => void;
};

const TitleComponent: React.FC<TitleComponentProps> = props => {
  const { isAlternativeAccountType, onAdd } = props;

  return (
    <Title title="FIO Wallets">
      <ActionButtonsContainer>
        <Link to={ROUTES.UNWRAP_TOKENS} className={classes.actionButton}>
          <Button>
            <ReplayIcon />
            <span>Unwrap Tokens</span>
          </Button>
        </Link>

        {!isAlternativeAccountType ? (
          <Link to={ROUTES.IMPORT_WALLET} className={classes.actionButton}>
            <Button>
              <SystemUpdateAltIcon fontSize="small" />
              <span>Import</span>
            </Button>
          </Link>
        ) : null}

        <Button onClick={onAdd} className={classes.actionButton}>
          <AddCircleIcon />
          <span>Add</span>
        </Button>
      </ActionButtonsContainer>
    </Title>
  );
};

const WalletsPage: React.FC<Props> = () => {
  const {
    fioWallets,
    fioWalletsBalances,
    isAlternativeAccountType,
    showCreateWalletModal,
    showWalletCreated,
    showWalletDeleted,
    showWalletImported,
    welcomeComponentProps,
    closeCreateWallet,
    closeCreatedWallet,
    closeImportedWallet,
    closeDeletedWallet,
    onAdd,
    onWalletCreated,
  } = useContext();

  return (
    <div className={classes.container}>
      <CreateWallet
        fioWallets={fioWallets}
        isAlternativeAccountType={isAlternativeAccountType}
        show={showCreateWalletModal}
        onClose={closeCreateWallet}
        onWalletCreated={onWalletCreated}
      />
      <LayoutContainer
        title={
          <TitleComponent
            onAdd={onAdd}
            isAlternativeAccountType={isAlternativeAccountType}
          />
        }
      >
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
        <TotalBalanceBadge
          {...fioWalletsBalances.total}
          isNew
          isMobile
          itTotalWallets
        />
        <WelcomeComponent {...welcomeComponentProps} />
      </LayoutContainer>
      <div className={classes.totalBalanceContainer}>
        <TotalBalanceBadge {...fioWalletsBalances.total} isNew itTotalWallets />
      </div>
    </div>
  );
};

export default WalletsPage;
