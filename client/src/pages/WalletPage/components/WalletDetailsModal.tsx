import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

import Modal from '../../../components/Modal/Modal';
import Badge, { BADGE_TYPES } from '../../../components/Badge/Badge';
import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';
import CopyTooltip from '../../../components/CopyTooltip';
import ShowPrivateKeyModal from './ShowPrivateKeyModal';
import LedgerBadge from '../../../components/Badges/LedgerBadge/LedgerBadge';
import ViewPubAddressLedgerWallet from './ViewPubAddress/ViewPubAddressLedgerWallet';
import InfoBadge from '../../../components/InfoBadge/InfoBadge';
import PageTitle from '../../../components/PageTitle/PageTitle';

import { LINKS } from '../../../constants/labels';
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

  const isLedgerWallet = from === WALLET_CREATED_FROM.LEDGER;
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [showLedgerPubKey, setShowLedgerPubKey] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [exportedPubAddress, setExportedPubAddress] = useState<string | null>(
    null,
  );
  const [viewingAddressInLedger, setViewingAddressInLedger] = useState<boolean>(
    false,
  );

  const onCopy = () => {
    copyToClipboard(publicKey);
  };

  const onShare = () =>
    shareData({
      text: publicKey,
    });
  const onKeyShow = () => setShowPrivateKeyModal(true);
  const onShowPrivateModalClose = () => setShowPrivateKeyModal(false);
  const onLedgerViewPubKey = () => {
    setExportedPubAddress(null);
    setShowLedgerPubKey(true);
  };
  const onLedgerViewPubKeyClose = (exportedKey?: string) => {
    setShowLedgerPubKey(false);
    setProcessing(false);
    setViewingAddressInLedger(false);
    if (exportedKey) setExportedPubAddress(exportedKey);
  };

  const renderShare = () => {
    if (!nativeShareIsAvailable) return null;

    return (
      <Button onClick={onShare} className={classes.iconContainer}>
        <FontAwesomeIcon icon="share-alt" className={classes.icon} />
      </Button>
    );
  };

  const renderShowPrivateKey = () => {
    if (isLedgerWallet) return null;
    return (
      <Button onClick={onKeyShow} className={classes.iconContainer}>
        <FontAwesomeIcon
          className={classes.icon}
          icon={{ prefix: 'fas', iconName: 'key' }}
        />
      </Button>
    );
  };

  const renderViewPubKey = () => {
    if (!isLedgerWallet) return null;

    return (
      <div className={classes.actionButtonsLeft}>
        <SubmitButton
          onClick={onLedgerViewPubKey}
          hasLowHeight={true}
          loading={processing}
          disabled={processing}
          text="View Public Address on Ledger"
        />
      </div>
    );
  };

  return (
    <>
      <PageTitle link={LINKS.FIO_WALLET_DETAILS} />
      <Modal
        show={
          show &&
          !showPrivateKeyModal &&
          (!showLedgerPubKey || viewingAddressInLedger)
        }
        isSimple={true}
        closeButton={true}
        onClose={onClose}
        isMiddleWidth={true}
        hasDefaultCloseColor={true}
      >
        <div className={classes.container}>
          {isLedgerWallet ? (
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

          <InfoBadge
            title=""
            message={
              <span className={classes.publicKey}>
                You can compare exported address with one above -<br />
                {exportedPubAddress}
              </span>
            }
            show={!!exportedPubAddress}
            type={BADGE_TYPES.INFO}
          />

          <InfoBadge
            title=""
            message="You can now view and compare your public address on your Ledger Device."
            show={viewingAddressInLedger}
            type={BADGE_TYPES.INFO}
          />

          <div className={classes.actionButtonsContainer}>
            {renderViewPubKey()}
            <div
              className={classnames(
                classes.actionButtons,
                !isLedgerWallet && classes.center,
              )}
            >
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
        </div>
      </Modal>
      <ShowPrivateKeyModal
        show={showPrivateKeyModal}
        fioWallet={props.fioWallet}
        onClose={onShowPrivateModalClose}
      />
      <ViewPubAddressLedgerWallet
        submitData={showLedgerPubKey}
        fioWallet={props.fioWallet}
        viewingAddressInLedger={viewingAddressInLedger}
        onSuccess={onLedgerViewPubKeyClose}
        onCancel={onLedgerViewPubKeyClose}
        setProcessing={setProcessing}
        setViewingAddressInLedger={setViewingAddressInLedger}
      />
    </>
  );
};

export default WalletDetailsModal;
