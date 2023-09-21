import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SettingsIcon from '@mui/icons-material/Settings';
import ReplayIcon from '@mui/icons-material/Replay';
import classnames from 'classnames';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';
import WalletSettings from './components/WalletSettings';
import FioLoader from '../../components/common/FioLoader/FioLoader';
import ActionButtonsContainer from '../WalletsPage/components/ActionButtonsContainer';
import TotalBalanceBadge from '../WalletsPage/components/TotalBalanceBadge';
import Title from '../WalletsPage/components/Title';
import EditWalletName from './components/EditWalletName';
import WalletTabs from './components/WalletTabs';
import InfoBadge from '../../components/InfoBadge/InfoBadge';
import { WelcomeComponent } from '../../components/WelcomeComponent';
import { WrapIcon } from '../../components/WrapIcon';

import { ROUTES } from '../../constants/routes';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import { useContext } from './WalletPageContext';

import classes from './styles/WalletPage.module.scss';

type TitleComponentProps = {
  publicKey: string;
  walletName: string;
  onKeyShow: () => void;
};

const TitleComponent: React.FC<TitleComponentProps> = props => {
  const { publicKey, walletName, onKeyShow } = props;

  const title = (
    <div className={classes.titleContainer}>
      <h3 className={classes.title}>{walletName}</h3>
      <div className={classes.titleActionButtons}>
        <Button
          className={classnames(classes.actionButton, classes.settingsButton)}
          onClick={onKeyShow}
        >
          <SettingsIcon />
        </Button>
      </div>
    </div>
  );

  return (
    <Title title={title}>
      <ActionButtonsContainer>
        <Link
          to={{
            pathname: ROUTES.FIO_TOKENS_RECEIVE,
            search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${publicKey}`,
          }}
          className={classes.actionButton}
        >
          <Button>
            <ArrowDownwardIcon />
            <span>Receive</span>
          </Button>
        </Link>

        <Link
          to={{
            pathname: ROUTES.SEND,
            search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${publicKey}`,
          }}
          className={classes.actionButton}
        >
          <Button>
            <ArrowUpwardIcon />
            <span>Send</span>
          </Button>
        </Link>

        <Link
          to={`${ROUTES.WRAP_TOKENS}?publicKey=${publicKey}`}
          className={classes.actionButton}
        >
          <Button>
            <WrapIcon />
            <span>Wrap</span>
          </Button>
        </Link>

        <Link
          to={`${ROUTES.UNWRAP_TOKENS}?publicKey=${publicKey}`}
          className={classes.actionButton}
        >
          <Button>
            <ReplayIcon />
            <span>Unwrap</span>
          </Button>
        </Link>
      </ActionButtonsContainer>
    </Title>
  );
};

const WalletPage: React.FC = () => {
  const {
    error,
    fioCryptoHandles,
    fioWallet,
    fioWalletBalance,
    fioWalletData,
    fioWalletTxHistory,
    hasNoTransactions,
    isOpenLockedList,
    showWalletSettings,
    showWalletNameEdit,
    receivedFioRequests,
    sentFioRequests,
    obtData,
    obtDataLoading,
    sentFioRequestsLoading,
    receivedFioRequestsLoading,
    welcomeComponentProps,
    closeWalletNameEdit,
    onKeyShow,
    onShowPrivateModalClose,
    onWalletUpdated,
    tabAction,
  } = useContext();

  if (error)
    return (
      <div className={classes.container}>
        <LayoutContainer title="Wallet">
          <InfoBadge
            message={error}
            show={!!error}
            title="Error"
            type={BADGE_TYPES.ERROR}
          />
        </LayoutContainer>
      </div>
    );

  if (!fioWallet || !fioWallet.id) return <FioLoader wrap={true} />;

  return (
    <div className={classes.container}>
      <WalletSettings
        show={showWalletSettings}
        fioWallet={fioWallet}
        onClose={onShowPrivateModalClose}
      />
      <EditWalletName
        show={showWalletNameEdit}
        fioWallet={fioWallet}
        onSuccess={onWalletUpdated}
        onClose={closeWalletNameEdit}
      />
      <LayoutContainer
        title={
          <TitleComponent
            publicKey={fioWallet.publicKey}
            walletName={fioWallet.name}
            onKeyShow={onKeyShow}
          />
        }
      >
        <h6 className={classes.transactionsTitle}>Recent Transactions</h6>
        <p className={classes.text}>
          View your transactions by type as well as sent or received.
        </p>
        <WalletTabs
          fioWallet={fioWallet}
          fioCryptoHandles={fioCryptoHandles}
          hasNoTransactions={hasNoTransactions}
          walletData={fioWalletData}
          walletTxHistory={fioWalletTxHistory}
          receivedFioRequests={receivedFioRequests}
          sentFioRequests={sentFioRequests}
          obtData={obtData}
          obtDataLoading={obtDataLoading}
          sentFioRequestsLoading={sentFioRequestsLoading}
          receivedFioRequestsLoading={receivedFioRequestsLoading}
          tabAction={tabAction}
        />
        <WelcomeComponent {...welcomeComponentProps} />
      </LayoutContainer>
      <div className={classes.actionBadges}>
        <TotalBalanceBadge
          {...fioWalletBalance}
          publicKey={fioWallet.publicKey}
          isOpenLockedList={isOpenLockedList}
        />
      </div>
    </div>
  );
};

export default WalletPage;
