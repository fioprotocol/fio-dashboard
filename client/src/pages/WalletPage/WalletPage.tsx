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

import apis from '../../api';

import { ROUTES } from '../../constants/routes';

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
    refreshBalance,
    fioWalletsData,
    fioWalletsTxHistory,
  } = props;

  const [showDetails, setShowDetails] = useState(false);
  const [showWalletNameEdit, setShowWalletNameEdit] = useState(false);

  const { location }: Location = useHistory();

  const { isOpenLockedList } = location.state || { isOpenLockedList: false };

  useEffect(() => {
    if (fioWallet && fioWallet.publicKey) refreshBalance(fioWallet.publicKey);
  }, [fioWallet]);

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

  if (!fioWallet || !fioWallet.id)
    return (
      <div className="d-flex justify-content-center align-items-center w-100 flex-grow-1">
        <FioLoader />
      </div>
    );

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
