import React from 'react';
import QRCode from 'qrcode.react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';
import CopyTooltip from '../../../../components/CopyTooltip';
import Modal from '../../../../components/Modal/Modal';

import classes from '../../../WalletPage/styles/WalletDetailsModal.module.scss';

import {
  copyToClipboard,
  nativeShareIsAvailable,
  shareData,
} from '../../../../util/general';
import { QrModalProps } from '../../../../components/Input/QrCodeInput';

const QrModal: React.FC<QrModalProps> = props => {
  const { isVisible, inputValue, handleClose } = props;

  const onShare = () =>
    shareData({
      text: inputValue,
    });

  const handleCopy = () => copyToClipboard(inputValue);

  const renderShare = () => {
    if (!nativeShareIsAvailable) return null;

    return (
      <Button onClick={onShare} className={classes.iconContainer}>
        <FontAwesomeIcon icon="share-alt" className={classes.icon} />
      </Button>
    );
  };

  return (
    <Modal
      show={isVisible}
      isSimple={true}
      closeButton={true}
      onClose={handleClose}
      isMiddleWidth={true}
      hasDefaultCloseColor={true}
    >
      <div className={classes.container}>
        <h3 className={classes.title}>Public Address Details</h3>
        <div className={classes.qrCode}>
          <QRCode value={inputValue} />
        </div>
        <Badge type={BADGE_TYPES.WHITE} show={true}>
          <div className={classes.publicAddressContainer}>
            <div className={classes.title}>Public Address</div>
            <div className={classes.publicKey}>{inputValue}</div>
          </div>
        </Badge>

        <div className={classes.actionButtons}>
          <CopyTooltip>
            <Button onClick={handleCopy} className={classes.iconContainer}>
              <FontAwesomeIcon
                className={classes.icon}
                icon={{ prefix: 'far', iconName: 'copy' }}
              />
            </Button>
          </CopyTooltip>

          {renderShare()}
        </div>
      </div>
    </Modal>
  );
};

export default QrModal;
