import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

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
import unwrapIcon from '../../assets/images/unwrap.svg';

type TitleComponentProps = {
  onAdd: () => void;
};

const TitleComponent: React.FC<TitleComponentProps> = props => {
  const { onAdd } = props;

  return (
    <Title title="FIO Wallets">
      <ActionButtonsContainer>
        <Link to={ROUTES.UNWRAP_TOKENS} className={classes.actionButton}>
          <Button>
            <img src={unwrapIcon} alt="unwrap" className={classes.unwrapIcon} />
            <span>Unwrap Tokens</span>
          </Button>
        </Link>

        <Link to={ROUTES.IMPORT_WALLET} className={classes.actionButton}>
          <Button>
            <SystemUpdateAltIcon fontSize="small" />
            <span>Import</span>
          </Button>
        </Link>

        <Button onClick={onAdd} className={classes.actionButton}>
          <FontAwesomeIcon icon="plus-circle" />
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
        show={showCreateWalletModal}
        onClose={closeCreateWallet}
        onWalletCreated={onWalletCreated}
      />
      <LayoutContainer title={<TitleComponent onAdd={onAdd} />}>
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
