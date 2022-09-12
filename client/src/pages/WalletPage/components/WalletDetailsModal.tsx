import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';

import Modal from '../../../components/Modal/Modal';
import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';
import CopyTooltip from '../../../components/CopyTooltip';
import ShowPrivateKeyModal from './ShowPrivateKeyModal';
import LedgerBadge from '../../../components/Badges/LedgerBadge/LedgerBadge';

import { WALLET_CREATED_FROM } from '../../../constants/common';

import {
  copyToClipboard,
  shareData,
  nativeShareIsAvailable,
} from '../../../util/general';

import { FioWalletDoublet } from '../../../types';

import classes from '../styles/WalletDetailsModal.module.scss';

type Props = {
  show: boolean;
  fioWallet: FioWalletDoublet;
  onClose: () => void;
};

const WalletDetailsModal: React.FC<Props> = props => {
  const {
    show,
    fioWallet: { publicKey, from },
    onClose,
  } = props;

  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);

  const onCopy = () => {
    copyToClipboard(publicKey);
  };

  const onShare = () =>
    shareData({
      text: publicKey,
    });
  const onKeyShow = () => setShowPrivateKeyModal(true);
  const onShowPrivateModalClose = () => setShowPrivateKeyModal(false);

  const renderShare = () => {
    if (!nativeShareIsAvailable) return null;

    return (
      <Button onClick={onShare} className={classes.iconContainer}>
        <FontAwesomeIcon icon="share-alt" className={classes.icon} />
      </Button>
    );
  };

  const renderShowPrivateKey = () => {
    if (from === WALLET_CREATED_FROM.LEDGER) return null;
    return (
      <Button onClick={onKeyShow} className={classes.iconContainer}>
        <FontAwesomeIcon
          className={classes.icon}
          icon={{ prefix: 'fas', iconName: 'key' }}
        />
      </Button>
    );
  };

  return (
    <>
      <Modal
        show={show && !showPrivateKeyModal}
        isSimple={true}
        closeButton={true}
        onClose={onClose}
        isMiddleWidth={true}
        hasDefaultCloseColor={true}
      >
        <div className={classes.container}>
          {from === WALLET_CREATED_FROM.LEDGER ? (
            <div className={classes.ledgerContainer}>
              <LedgerBadge />
            </div>
          ) : (
            ''
          )}
          <h3 className={classes.title}>Wallet Details</h3>
          <div className={classes.qrCode}>
            <QRCode value={publicKey} />
          </div>
          <Badge type={BADGE_TYPES.WHITE} show={true}>
            <div className={classes.publicAddressContainer}>
              <div className={classes.title}>Public Address</div>
              <div className={classes.publicKey}>{publicKey}</div>
            </div>
          </Badge>

          <div className={classes.actionButtons}>
            <CopyTooltip>
              <Button onClick={onCopy} className={classes.iconContainer}>
                <FontAwesomeIcon
                  className={classes.icon}
                  icon={{ prefix: 'far', iconName: 'copy' }}
                />
              </Button>
            </CopyTooltip>
            {renderShare()}

            {renderShowPrivateKey()}
          </div>
        </div>
      </Modal>
      <ShowPrivateKeyModal
        show={showPrivateKeyModal}
        fioWallet={props.fioWallet}
        onClose={onShowPrivateModalClose}
      />
    </>
  );
};

export default WalletDetailsModal;
