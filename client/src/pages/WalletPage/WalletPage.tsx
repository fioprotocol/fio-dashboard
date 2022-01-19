import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';
import WalletDetailsModal from './components/WalletDetailsModal';
import FioLoader from '../../components/common/FioLoader/FioLoader';
import ActionButtonsContainer from '../WalletsPage/components/ActionButtonsContainer';
import TotalBalanceBadge from '../WalletsPage/components/TotalBalanceBadge';
import TransactionHistory from './components/TransactionHistory';
import EditWalletName from './components/EditWalletName';
import WalletTabs from './components/WalletTabs';
import { BADGE_TYPES } from '../../components/Badge/Badge';
import InfoBadge from '../../components/InfoBadge/InfoBadge';

import apis from '../../api';

import { putParamsToUrl } from '../../utils';
import { ROUTES } from '../../constants/routes';

import { ContainerProps } from './types';

import classes from './styles/WalletPage.module.scss';

const WalletPage: React.FC<ContainerProps> = props => {
  const { fioWallet, balance, refreshBalance } = props;

  const [showDetails, setShowDetails] = useState(false);
  const [showWalletNameEdit, setShowWalletNameEdit] = useState(false);

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
      <LayoutContainer title={renderTitle()} onTitleClick={onWalletEdit}>
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
        <InfoBadge
          title="Transaction Display"
          message="Only FIO Requests are displayed below. Please visit the Explorer to view you total transaction history."
          show={true}
          type={BADGE_TYPES.INFO}
        />
        <p className={classes.text}>
          View your transactions by type as well as sent or received.
        </p>
        <WalletTabs />
      </LayoutContainer>
      <div className={classes.actionBadges}>
        <TotalBalanceBadge {...balance} />
        <TransactionHistory actorName={actorName} />
      </div>
    </div>
  );
};

export default WalletPage;
