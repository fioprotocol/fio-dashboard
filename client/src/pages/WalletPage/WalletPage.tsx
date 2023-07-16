import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import SettingsIcon from '@mui/icons-material/Settings';
import classnames from 'classnames';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';
import ShowPrivateKeyModal from './components/ShowPrivateKeyModal';
import FioLoader from '../../components/common/FioLoader/FioLoader';
import ActionButtonsContainer from '../WalletsPage/components/ActionButtonsContainer';
import TotalBalanceBadge from '../WalletsPage/components/TotalBalanceBadge';
import Title from '../WalletsPage/components/Title';
import EditWalletName from './components/EditWalletName';
import WalletTabs from './components/WalletTabs';
import InfoBadge from '../../components/InfoBadge/InfoBadge';

import { ROUTES } from '../../constants/routes';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import { WALLET_CREATED_FROM } from '../../constants/common';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { ContainerProps, LocationProps } from './types';

import classes from './styles/WalletPage.module.scss';
import wrapIcon from '../../assets/images/wrap.svg';
import unwrapIcon from '../../assets/images/unwrap.svg';
import { WelcomeComponent } from '../DashboardPage/components/WelcomeComponent';

const WalletPage: React.FC<ContainerProps & LocationProps> = props => {
  const {
    fioWallet,
    fioCryptoHandles,
    balance,
    profileRefreshed,
    refreshBalance,
    fioWalletsData = {},
    fioWalletsTxHistory,
    location: {
      query: { publicKey } = {},
      state: { isOpenLockedList = false } = {},
    },
  } = props;

  const isLedgerWallet = fioWallet?.from === WALLET_CREATED_FROM.LEDGER;
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [showWalletNameEdit, setShowWalletNameEdit] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (fioWallet && fioWallet.publicKey) refreshBalance(fioWallet.publicKey);
  }, [fioWallet, refreshBalance]);

  useEffect(() => {
    if (publicKey && profileRefreshed && !fioWallet)
      setError(`FIO Wallet (${publicKey}) is not available`);
  }, [publicKey, fioWallet, profileRefreshed]);

  const onShowPrivateModalClose = () => setShowPrivateKeyModal(false);
  const closeWalletNameEdit = () => setShowWalletNameEdit(false);

  const onKeyShow = () => setShowPrivateKeyModal(true);

  const onWalletUpdated = () => {
    closeWalletNameEdit();
  };

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

  const renderTitle = () => {
    const title = (
      <div className={classes.titleContainer}>
        <h3 className={classes.title}>{fioWallet.name}</h3>
        <div className={classes.titleActionButtons}>
          {!isLedgerWallet && (
            <a
              href="#"
              className={classnames(
                classes.actionButton,
                classes.settingsButton,
              )}
              onClick={onKeyShow}
            >
              <Button>
                <SettingsIcon />
              </Button>
            </a>
          )}
        </div>
      </div>
    );
    return (
      <Title title={title}>
        <ActionButtonsContainer>
          <Link
            to={{
              pathname: ROUTES.FIO_TOKENS_RECEIVE,
              search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioWallet.publicKey}`,
            }}
            className={classes.actionButton}
          >
            <Button>
              <FontAwesomeIcon icon="arrow-down" />
              <span>Receive</span>
            </Button>
          </Link>

          <Link
            to={{
              pathname: ROUTES.SEND,
              search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioWallet.publicKey}`,
            }}
            className={classes.actionButton}
          >
            <Button>
              <FontAwesomeIcon icon="arrow-up" />
              <span>Send</span>
            </Button>
          </Link>

          <Link
            to={`${ROUTES.WRAP_TOKENS}?publicKey=${fioWallet.publicKey}`}
            className={classes.actionButton}
          >
            <Button>
              <img src={wrapIcon} alt="wrap" />
              <span>Wrap</span>
            </Button>
          </Link>

          <Link
            to={`${ROUTES.UNWRAP_TOKENS}?publicKey=${fioWallet.publicKey}`}
            className={classes.actionButton}
          >
            <Button>
              <img src={unwrapIcon} alt="unwrap" />
              <span>Unwrap</span>
            </Button>
          </Link>
        </ActionButtonsContainer>
      </Title>
    );
  };
  const hasNoTransactions =
    balance.total.nativeFio === 0 &&
    fioWalletsTxHistory[fioWallet.publicKey]?.txs.length === 0;

  return (
    <div className={classes.container}>
      <ShowPrivateKeyModal
        show={showPrivateKeyModal}
        fioWallet={fioWallet}
        onClose={onShowPrivateModalClose}
      />
      <EditWalletName
        show={showWalletNameEdit}
        fioWallet={fioWallet}
        onSuccess={onWalletUpdated}
        onClose={closeWalletNameEdit}
      />
      <LayoutContainer title={renderTitle()}>
        <h6 className={classes.transactionsTitle}>Recent Transactions</h6>
        <hr />
        <InfoBadge
          message={
            <span>
              Only FIO Requests are displayed below. Please visit the{' '}
              <b style={{ fontFamily: 'Proxima Nova Bold' }}>Explore</b> to view
              you total transaction history.
            </span>
          }
          show={true}
          title="Transaction Display"
          type={BADGE_TYPES.INFO}
        />
        <p className={classes.text}>
          View your transactions by type as well as sent or received.
        </p>
        <WalletTabs
          fioWallet={fioWallet}
          fioCryptoHandles={fioCryptoHandles}
          hasNoTransactions={hasNoTransactions}
          walletData={fioWalletsData[fioWallet.publicKey]}
          walletTxHistory={fioWalletsTxHistory[fioWallet.publicKey]}
        />
        <WelcomeComponent onlyActions noPaddingTop />
      </LayoutContainer>
      <div className={classes.actionBadges}>
        <TotalBalanceBadge
          {...balance}
          publicKey={fioWallet.publicKey}
          isOpenLockedList={isOpenLockedList}
        />
      </div>
    </div>
  );
};

export default WalletPage;
