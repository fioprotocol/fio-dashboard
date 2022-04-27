import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';
import WalletDetailsModal from './components/WalletDetailsModal';
import FioLoader from '../../components/common/FioLoader/FioLoader';
import ActionButtonsContainer from '../WalletsPage/components/ActionButtonsContainer';
import TotalBalanceBadge from '../WalletsPage/components/TotalBalanceBadge';
import TransactionHistory from './components/TransactionHistory';
import EditWalletName from './components/EditWalletName';
import WalletTabs from './components/WalletTabs';
import InfoBadge from '../../components/InfoBadge/InfoBadge';

import apis from '../../api';

import { ROUTES } from '../../constants/routes';
import { BADGE_TYPES } from '../../components/Badge/Badge';

import { putParamsToUrl } from '../../utils';

import { ContainerProps } from './types';

import classes from './styles/WalletPage.module.scss';

type Location = {
  location: {
    state: {
      isOpenLockedList: boolean;
    };
  };
};

const WalletPage: React.FC<ContainerProps> = props => {
  const {
    fioWallet,
    balance,
    profileRefreshed,
    refreshBalance,
    fioWalletsData,
    fioWalletsTxHistory,
    match: {
      params: { publicKey },
    },
  } = props;

  const [showDetails, setShowDetails] = useState(false);
  const [showWalletNameEdit, setShowWalletNameEdit] = useState(false);
  const [error, setError] = useState<string>('');

  const { location }: Location = useHistory();

  const { isOpenLockedList } = location.state || { isOpenLockedList: false };

  useEffect(() => {
    if (fioWallet && fioWallet.publicKey) refreshBalance(fioWallet.publicKey);
  }, [fioWallet, refreshBalance]);

  useEffect(() => {
    if (publicKey && profileRefreshed && !fioWallet)
      setError(`Fio Wallet (${publicKey}) is not available`);
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
    return (
      <>
        {fioWallet.name}
        <FontAwesomeIcon
          icon="pen"
          onClick={onWalletEdit}
          className={classes.editIcon}
        />
      </>
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
        <ActionButtonsContainer>
          <Link
            to={putParamsToUrl(ROUTES.FIO_TOKENS_REQUEST, {
              publicKey: fioWallet.publicKey,
            })}
            className={classes.firstLink}
          >
            <div>
              <FontAwesomeIcon icon="arrow-down" />
            </div>
          </Link>
          <Link
            to={putParamsToUrl(ROUTES.SEND, {
              publicKey: fioWallet.publicKey,
            })}
          >
            <div>
              <FontAwesomeIcon icon="arrow-up" />
            </div>
          </Link>
          <div onClick={onDetails}>
            <FontAwesomeIcon icon="qrcode" />
          </div>
        </ActionButtonsContainer>

        <p className={classes.subtitle}>Manage your FIO tokens</p>
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
