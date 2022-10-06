import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';
import WalletDetailsModal from './components/WalletDetailsModal';
import FioLoader from '../../components/common/FioLoader/FioLoader';
import ActionButtonsContainer from '../WalletsPage/components/ActionButtonsContainer';
import TotalBalanceBadge from '../WalletsPage/components/TotalBalanceBadge';
import Title from '../WalletsPage/components/Title';
import TransactionHistory from './components/TransactionHistory';
import EditWalletName from './components/EditWalletName';
import WalletTabs from './components/WalletTabs';
import InfoBadge from '../../components/InfoBadge/InfoBadge';

import apis from '../../api';

import { ROUTES } from '../../constants/routes';
import { BADGE_TYPES } from '../../components/Badge/Badge';

import { ContainerProps, LocationProps } from './types';

import classes from './styles/WalletPage.module.scss';

const WalletPage: React.FC<ContainerProps & LocationProps> = props => {
  const {
    fioWallet,
    balance,
    profileRefreshed,
    refreshBalance,
    fioWalletsData,
    fioWalletsTxHistory,
    location: {
      query: { publicKey } = {},
      state: { isOpenLockedList = false } = {},
    },
  } = props;

  const [showDetails, setShowDetails] = useState(false);
  const [showWalletNameEdit, setShowWalletNameEdit] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (fioWallet && fioWallet.publicKey) refreshBalance(fioWallet.publicKey);
  }, [fioWallet, refreshBalance]);

  useEffect(() => {
    if (publicKey && profileRefreshed && !fioWallet)
      setError(`FIO Wallet (${publicKey}) is not available`);
  }, [publicKey, fioWallet, profileRefreshed]);

  const closeWalletDetails = () => setShowDetails(false);
  const closeWalletNameEdit = () => setShowWalletNameEdit(false);

  const onDetails = () => {
    setShowDetails(true);
  };
  const onWalletEdit = () => {
    setShowWalletNameEdit(true);
  };
  const onWalletUpdated = () => {
    closeWalletNameEdit();
  };

  const actorName = fioWallet ? apis.fio.getActor(fioWallet.publicKey) : '';

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
      <>
        {fioWallet.name}
        <FontAwesomeIcon
          icon="pen"
          onClick={onWalletEdit}
          className={classes.editIcon}
        />
      </>
    );
    return (
      <Title title={title} subtitle="Manage your FIO tokens">
        <ActionButtonsContainer>
          <Link
            to={{
              pathname: ROUTES.FIO_TOKENS_REQUEST,
              search: `publicKey=${fioWallet.publicKey}`,
            }}
            className={classes.firstLink}
          >
            <div>
              <FontAwesomeIcon icon="arrow-down" />
            </div>
          </Link>
          <Link
            to={{
              pathname: ROUTES.SEND,
              search: `publicKey=${fioWallet.publicKey}`,
            }}
          >
            <div>
              <FontAwesomeIcon icon="arrow-up" />
            </div>
          </Link>
          <div onClick={onDetails}>
            <FontAwesomeIcon icon="qrcode" />
          </div>
        </ActionButtonsContainer>
      </Title>
    );
  };

  return (
    <div className={classes.container}>
      {showDetails ? (
        <WalletDetailsModal
          show={true}
          fioWallet={fioWallet}
          onClose={closeWalletDetails}
        />
      ) : null}
      {showWalletNameEdit ? (
        <EditWalletName
          show={showWalletNameEdit}
          fioWallet={fioWallet}
          onSuccess={onWalletUpdated}
          onClose={closeWalletNameEdit}
        />
      ) : null}
      <LayoutContainer title={renderTitle()}>
        <p className={classes.text}>
          View your transactions by type as well as sent or received.
        </p>
        <WalletTabs
          fioWallet={fioWallet}
          walletData={fioWalletsData[fioWallet.publicKey]}
          walletTxHistory={fioWalletsTxHistory[fioWallet.publicKey]}
        />
      </LayoutContainer>
      <div className={classes.actionBadges}>
        <TotalBalanceBadge
          {...balance}
          publicKey={fioWallet.publicKey}
          isOpenLockedList={isOpenLockedList}
        />
        <TransactionHistory actorName={actorName} />
      </div>
    </div>
  );
};

export default WalletPage;
