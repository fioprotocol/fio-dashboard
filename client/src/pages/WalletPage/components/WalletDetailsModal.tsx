import React from 'react';
import QRCode from 'qrcode.react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

import Modal from '../../../components/Modal/Modal';
import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';
import CopyTooltip from '../../../components/CopyTooltip';

import { FioWalletDoublet } from '../../../types';
import { WALLET_CREATED_FROM } from '../../../constants/common';
import {
  copyToClipboard,
  shareData,
  nativeShareIsAvailable,
} from '../../../util/general';

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

  const onCopy = () => {
    copyToClipboard(publicKey);
  };

  const onShare = () =>
    shareData({
      text: publicKey,
    });
  const onKeyShow = () => {
    // todo: show private key modal
  };

  const renderShare = () => {
    if (!nativeShareIsAvailable) return null;

    return (
      <Button onClick={onShare} className={classes.iconContainer}>
        <FontAwesomeIcon icon="share-alt" className={classes.icon} />
      </Button>
    );
  };

  // @ts-ignore
  // eslint-disable-next-line no-unused-vars
  const renderShowPrivateKey = () => {
    if (from === WALLET_CREATED_FROM.LEDGER) return null;
    return (
      <div onClick={onKeyShow}>
        <FontAwesomeIcon icon={faKey} />
      </div>
    );
  };

  return (
    <Modal
      show={show}
      isSimple={true}
      closeButton={true}
      onClose={onClose}
      isMiddleWidth={true}
      hasDefaultCloseColor={true}
    >
      <div className={classes.container}>
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

          {/*{renderShowPrivateKey()}*/}
        </div>
      </div>
    </Modal>
  );
};

export default WalletDetailsModal;
