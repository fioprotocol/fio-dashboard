import React, { Fragment } from 'react';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';

import ImportExportIcon from '@mui/icons-material/ImportExport';

import Modal from '../Modal';
import LedgerBadge from '../../Badges/LedgerBadge/LedgerBadge';

import { TransactionInfoBadge } from './components/TransactionInfoBadge';

import apis from '../../../api';
import {
  AnyType,
  FioWalletDoublet,
  NFTTokenDoublet,
  SocialMediaLinkIdProp,
} from '../../../types';

import classes from './ConnectionModal.module.scss';
import {
  CONFIRM_LEDGER_ACTIONS,
  DOMAIN_STATUS,
} from '../../../constants/common';
import { SendTokensValues } from '../../../pages/SendPage/types';
import { StakeTokensValues } from '../../../pages/StakeTokensPage/types';
import { WrapTokensValues } from '../../../pages/WrapTokensPage/types';
import { WrapDomainValues } from '../../../pages/WrapDomainPage/types';
import { EditTokenValues } from '../../../pages/EditTokenPage/types';
import { AddTokenValues } from '../../../pages/AddTokenPage/types';
import { DeleteTokenValues } from '../../../pages/DeleteTokenPage/types';
import { FioNameTransferValues } from '../../FioNameTransfer/types';
import { RequestTokensValues } from '../../../pages/FioTokensRequestPage/types';
import { FioRecordViewDecrypted } from '../../../pages/WalletPage/types';
import { FioDomainStatusValues } from '../../../pages/FioDomainStatusChangePage/types';
import { AddSocialMediaLinkValues } from '../../../pages/AddSocialMediaLinksPage/types';
import { DeleteSocialMediaLinkValues } from '../../../pages/DeleteSocialMediaLinksPage/types';
import { EditSocialLinkValues } from '../../../pages/EditSocialMediaLinksPage/types';
import { PurchaseValues } from '../../PurchaseNow/types';
import { PaymentDetailsValues } from '../../../pages/TokensRequestPaymentPage/types';

type Props = {
  action: string;
  data: AnyType | null;
  fioWallet?: FioWalletDoublet;
  fee: number;
  oracleFee: number;
  show: boolean;
  onClose: () => void;
  onContinue?: () => void;
  message?: string;
  isTransaction?: boolean;
  isAwaiting?: boolean;
};

const ConnectionModal: React.FC<Props> = props => {
  const {
    action,
    data,
    fioWallet,
    fee,
    oracleFee,
    show,
    message,
    isAwaiting,
    isTransaction,
    onClose,
    onContinue,
  } = props;

  const renderContinue = () => {
    if (!onContinue) return null;

    return (
      <Button
        className={`${classes.button} ${isTransaction ? classes.light : ''}`}
        onClick={onContinue}
      >
        Continue
      </Button>
    );
  };

  const renderRegular = () => (
    <>
      <ImportExportIcon className={classes.connectIcon} />
      <h4 className={classes.title}>Connect</h4>
      <p className={classes.text}>
        {message
          ? message
          : 'Please connect your Ledger device and open FIO App.'}
      </p>
      {renderContinue()}
      {!isAwaiting && !onContinue ? (
        <Button className={classes.button} onClick={onClose}>
          Close
        </Button>
      ) : null}
    </>
  );

  const renderTransactionInfo = () => {
    if (action === CONFIRM_LEDGER_ACTIONS.SEND) {
      const {
        amount,
        nativeAmount,
        toPubKey,
        fromPubKey,
      } = data as SendTokensValues;

      return (
        <>
          <TransactionInfoBadge title="FIO Public Address">
            {toPubKey}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="From FIO Public Address">
            {fromPubKey}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Send Amount">
            {amount ?? apis.fio.sufToAmount(parseFloat(nativeAmount))} FIO
          </TransactionInfoBadge>
          {fee && (
            <TransactionInfoBadge title="Transaction Fee">
              {apis.fio.sufToAmount(fee)} FIO
            </TransactionInfoBadge>
          )}
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.STAKE) {
      const {
        publicKey,
        fioAddress,
        amount,
        nativeAmount,
      } = data as StakeTokensValues;

      return (
        <>
          <TransactionInfoBadge title="FIO Handle">
            {fioAddress}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="FIO Public Address">
            {publicKey}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Stake Amount">
            {amount ?? apis.fio.sufToAmount(parseFloat(nativeAmount))} FIO
          </TransactionInfoBadge>
          {fee && (
            <TransactionInfoBadge title="Transaction Fee">
              {apis.fio.sufToAmount(fee)} FIO
            </TransactionInfoBadge>
          )}
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.UNSTAKE) {
      const {
        publicKey,
        fioAddress,
        amount,
        nativeAmount,
      } = data as StakeTokensValues;

      return (
        <>
          <TransactionInfoBadge title="FIO Handle">
            {fioAddress}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="FIO Public Address">
            {publicKey}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Unstake Amount">
            {amount ?? apis.fio.sufToAmount(parseFloat(nativeAmount))} FIO
          </TransactionInfoBadge>
          {fee && (
            <TransactionInfoBadge title="Transaction Fee">
              {apis.fio.sufToAmount(fee)} FIO
            </TransactionInfoBadge>
          )}
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.WRAP_TOKENS) {
      const { tpid, amount, publicAddress } = data as WrapTokensValues;

      return (
        <>
          <TransactionInfoBadge title="FIO Handle">{tpid}</TransactionInfoBadge>
          {fioWallet && (
            <TransactionInfoBadge title="FIO Public Address">
              {fioWallet.publicKey}
            </TransactionInfoBadge>
          )}
          <TransactionInfoBadge title="ETH Public Address">
            {publicAddress}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Wrap Amount">
            {amount} FIO
          </TransactionInfoBadge>
          {fee && (
            <TransactionInfoBadge title="Transaction Fee">
              {apis.fio.sufToAmount(fee)} FIO
            </TransactionInfoBadge>
          )}
          {oracleFee && (
            <TransactionInfoBadge title="Oracle Fee">
              {apis.fio.sufToAmount(oracleFee)} FIO
            </TransactionInfoBadge>
          )}
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.WRAP_DOMAIN) {
      const { tpid, name, publicAddress } = data as WrapDomainValues;

      return (
        <>
          <TransactionInfoBadge title="Wrap Domain">
            {name}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="FIO Handle">{tpid}</TransactionInfoBadge>
          {fioWallet && (
            <TransactionInfoBadge title="FIO Public Address">
              {fioWallet.publicKey}
            </TransactionInfoBadge>
          )}
          <TransactionInfoBadge title="MATIC Public Address">
            {publicAddress}
          </TransactionInfoBadge>
          {fee && (
            <TransactionInfoBadge title="Transaction Fee">
              {apis.fio.sufToAmount(fee)} FIO
            </TransactionInfoBadge>
          )}
          {oracleFee && (
            <TransactionInfoBadge title="Oracle Fee">
              {apis.fio.sufToAmount(oracleFee)} FIO
            </TransactionInfoBadge>
          )}
        </>
      );
    }

    if (
      action === CONFIRM_LEDGER_ACTIONS.EDIT_TOKEN &&
      'pubAddressesArr' in (data as EditTokenValues)
    ) {
      const { pubAddressesArr, fioAddressName } = data as EditTokenValues;

      return (
        <>
          <TransactionInfoBadge title="FIO Handle">
            {fioAddressName}
          </TransactionInfoBadge>
          {fioWallet && (
            <TransactionInfoBadge title="FIO Public Address">
              {fioWallet.publicKey}
            </TransactionInfoBadge>
          )}
          <TransactionInfoBadge title="Mappings">
            {pubAddressesArr
              .filter(it => it.newPublicAddress !== '')
              .map(
                ({
                  publicAddress,
                  newPublicAddress,
                  chainCode,
                  tokenCode,
                  id,
                }) => (
                  <Fragment key={id}>
                    <b>
                      {chainCode}:{tokenCode}:
                    </b>
                    {newPublicAddress || publicAddress}
                    <br />
                  </Fragment>
                ),
              )}
          </TransactionInfoBadge>
        </>
      );
    }

    if (
      action === CONFIRM_LEDGER_ACTIONS.EDIT_TOKEN &&
      'socialMediaLinksList' in (data as EditSocialLinkValues)
    ) {
      const { fch, socialMediaLinksList } = data as EditSocialLinkValues;

      return (
        <>
          <TransactionInfoBadge title="FIO Handle">{fch}</TransactionInfoBadge>
          {fioWallet && (
            <TransactionInfoBadge title="FIO Public Address">
              {fioWallet.publicKey}
            </TransactionInfoBadge>
          )}
          <TransactionInfoBadge title="Mappings">
            {socialMediaLinksList
              .filter(it => it.newUsername !== '')
              .map(({ username, newUsername, tokenName, id }) => (
                <Fragment key={id}>
                  <b>SOCIALS:{tokenName}:</b>
                  {newUsername || username}
                  <br />
                </Fragment>
              ))}
          </TransactionInfoBadge>
        </>
      );
    }

    if (
      action === CONFIRM_LEDGER_ACTIONS.ADD_TOKEN &&
      'tokens' in (data as AddTokenValues)
    ) {
      const { name, tokens } = data as AddTokenValues;

      return (
        <>
          <TransactionInfoBadge title="FIO Handle">{name}</TransactionInfoBadge>
          {fioWallet && (
            <TransactionInfoBadge title="FIO Public Address">
              {fioWallet.publicKey}
            </TransactionInfoBadge>
          )}
          <TransactionInfoBadge title="Mappings">
            {tokens.map(({ publicAddress, chainCode, tokenCode }) => (
              <Fragment key={`${chainCode}-${tokenCode}-${publicAddress}`}>
                <b>
                  {chainCode}:{tokenCode}:
                </b>
                {publicAddress}
                <br />
              </Fragment>
            ))}
          </TransactionInfoBadge>
        </>
      );
    }

    if (
      action === CONFIRM_LEDGER_ACTIONS.ADD_TOKEN &&
      'socialMediaLinksList' in (data as AddSocialMediaLinkValues)
    ) {
      const { fch, socialMediaLinksList } = data as AddSocialMediaLinkValues;

      return (
        <>
          <TransactionInfoBadge title="FIO Handle">{fch}</TransactionInfoBadge>
          {fioWallet && (
            <TransactionInfoBadge title="FIO Public Address">
              {fioWallet.publicKey}
            </TransactionInfoBadge>
          )}
          <TransactionInfoBadge title="Mappings">
            {Object.keys(socialMediaLinksList).map(key => (
              <Fragment key={key}>
                <b>SOCIALS:{key}:</b>
                {socialMediaLinksList[key as SocialMediaLinkIdProp]}
                <br />
              </Fragment>
            ))}
          </TransactionInfoBadge>
        </>
      );
    }

    if (
      action === CONFIRM_LEDGER_ACTIONS.DELETE_TOKEN &&
      'pubAddressesArr' in (data as DeleteTokenValues)
    ) {
      const { fioCryptoHandle, pubAddressesArr } = data as DeleteTokenValues;

      return (
        <>
          <TransactionInfoBadge title="FIO Handle">
            {fioCryptoHandle.name}
          </TransactionInfoBadge>
          {fioWallet && (
            <TransactionInfoBadge title="FIO Public Address">
              {fioWallet.publicKey}
            </TransactionInfoBadge>
          )}
          <TransactionInfoBadge title="Deleting Mappings">
            {pubAddressesArr
              .filter(it => it.isChecked)
              .map(({ publicAddress, chainCode, tokenCode, id }) => (
                <Fragment key={id}>
                  <b>
                    {chainCode}:{tokenCode}:
                  </b>
                  {publicAddress}
                  <br />
                </Fragment>
              ))}
          </TransactionInfoBadge>
        </>
      );
    }

    if (
      action === CONFIRM_LEDGER_ACTIONS.DELETE_TOKEN &&
      'socialMediaLinksList' in (data as DeleteSocialMediaLinkValues)
    ) {
      const { fch, socialMediaLinksList } = data as DeleteSocialMediaLinkValues;

      return (
        <>
          <TransactionInfoBadge title="FIO Handle">{fch}</TransactionInfoBadge>
          {fioWallet && (
            <TransactionInfoBadge title="FIO Public Address">
              {fioWallet.publicKey}
            </TransactionInfoBadge>
          )}
          <TransactionInfoBadge title="Deleting Mappings">
            {socialMediaLinksList
              .filter(it => it.isChecked)
              .map(({ publicAddress, chainCode, tokenCode, id }) => (
                <Fragment key={id}>
                  <b>
                    {chainCode}:{tokenCode}:
                  </b>
                  {publicAddress}
                  <br />
                </Fragment>
              ))}
          </TransactionInfoBadge>
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.TRANSFER) {
      const { name, newOwnerPublicKey } = data as FioNameTransferValues;

      return (
        <>
          <TransactionInfoBadge title="FIO Handle">{name}</TransactionInfoBadge>
          {fioWallet && (
            <TransactionInfoBadge title="FIO Public Address">
              {fioWallet.publicKey}
            </TransactionInfoBadge>
          )}
          <TransactionInfoBadge title="New Owner FIO Public Address">
            {newOwnerPublicKey}
          </TransactionInfoBadge>
          {fee && (
            <TransactionInfoBadge title="Transaction Fee">
              {apis.fio.sufToAmount(fee)} FIO
            </TransactionInfoBadge>
          )}
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.SIGN_NFT) {
      const {
        contractAddress,
        chainCode,
        tokenId,
        fioAddress,
      } = data as NFTTokenDoublet;

      return (
        <>
          <TransactionInfoBadge title="FIO Handle">
            {fioAddress}
          </TransactionInfoBadge>
          {fioWallet && (
            <TransactionInfoBadge title="FIO Public Address">
              {fioWallet.publicKey}
            </TransactionInfoBadge>
          )}
          <TransactionInfoBadge title="Chain Code">
            {chainCode}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Contract Address">
            {contractAddress}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="NFT Token ID">
            {tokenId}
          </TransactionInfoBadge>
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.REQUEST) {
      const {
        payeeFioAddress,
        payerFioAddress,
        payeeTokenPublicAddress,
        payerFioPublicKey,
        amount,
        chainCode,
        tokenCode,
      } = data as RequestTokensValues;

      return (
        <>
          <TransactionInfoBadge title="Payer FIO Handle">
            {payerFioAddress}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Payee FIO Handle">
            {payeeFioAddress}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Payer FIO Public Address">
            {payerFioPublicKey}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Payee FIO Public Address">
            {payeeTokenPublicAddress}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Chain Code">
            {chainCode}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Token Code">
            {tokenCode}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Amount Requested">
            {amount} {tokenCode}
          </TransactionInfoBadge>
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.CANCEL_FIO_REQUEST) {
      const { fioRecord } = data as FioRecordViewDecrypted;

      return (
        <>
          <TransactionInfoBadge title="Request ID">
            {fioRecord.id} FIO
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Sign with FIO Public Address">
            {fioRecord.payeeFioPublicKey} FIO
          </TransactionInfoBadge>
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.SET_VISIBILITY) {
      const { name, publicStatusToSet } = data as FioDomainStatusValues;

      return (
        <>
          <TransactionInfoBadge title="FIO Handle">{name}</TransactionInfoBadge>
          {fioWallet && (
            <TransactionInfoBadge title="FIO Public Address">
              {fioWallet.publicKey}
            </TransactionInfoBadge>
          )}
          <TransactionInfoBadge title="Status">
            {(publicStatusToSet === 1
              ? DOMAIN_STATUS.PUBLIC
              : DOMAIN_STATUS.PRIVATE
            ).toUpperCase()}
          </TransactionInfoBadge>
          {fee && (
            <TransactionInfoBadge title="Transaction Fee">
              {apis.fio.sufToAmount(fee)} FIO
            </TransactionInfoBadge>
          )}
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.PURCHASE) {
      const { cartItems } = data as PurchaseValues;

      const totalFee = cartItems
        .map(it => it.costNativeFio)
        .map(fee => apis.fio.sufToAmount(fee))
        .reduce((sum, fee) => sum + fee, 0);

      return (
        <>
          {fioWallet && (
            <TransactionInfoBadge title="FIO Public Address">
              {fioWallet.publicKey}
            </TransactionInfoBadge>
          )}
          <TransactionInfoBadge title="Transaction Fee">
            {totalFee} FIO
          </TransactionInfoBadge>
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.PAYMENT_DETAILS) {
      const {
        fioRequestId,
        payeeFioAddress,
        payerFioAddress,
        payeePublicAddress,
        amount,
        tokenCode,
        chainCode,
        obtId,
      } = data as PaymentDetailsValues;

      return (
        <>
          <TransactionInfoBadge title="Request ID">
            {fioRequestId}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Payee FIO Handle">
            {payeeFioAddress}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Payer FIO Handle">
            {payerFioAddress}
          </TransactionInfoBadge>
          {fioWallet && (
            <TransactionInfoBadge title="FIO Public Address">
              {fioWallet.publicKey}
            </TransactionInfoBadge>
          )}
          {fioWallet && (
            <TransactionInfoBadge title="Payee FIO Public Address">
              {payeePublicAddress}
            </TransactionInfoBadge>
          )}
          <TransactionInfoBadge title="Obt ID">{obtId}</TransactionInfoBadge>
          <TransactionInfoBadge title="Chain Code">
            {chainCode}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Token Code">
            {tokenCode}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Amount Requested">
            {amount} {tokenCode}
          </TransactionInfoBadge>
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.REJECT_FIO_REQUEST) {
      const { fioRecord } = data as FioRecordViewDecrypted;

      return (
        <>
          <TransactionInfoBadge title="Request ID">
            {fioRecord.id}
          </TransactionInfoBadge>
          {fioWallet && (
            <TransactionInfoBadge title="FIO Public Address">
              {fioWallet.publicKey}
            </TransactionInfoBadge>
          )}
        </>
      );
    }

    return null;
  };

  const renderTransaction = () => (
    <div className={classes.transactionContent}>
      <LedgerBadge />
      <h4 className={classes.transactionTitle}>
        Confirm & Complete Transaction
      </h4>
      <p className={classes.transactionText}>{message}</p>
      {renderContinue()}
      {renderTransactionInfo()}
    </div>
  );

  return (
    <Modal
      classNames={{
        dialog: classnames(isTransaction && classes.dialog),
      }}
      show={show}
      isBlue={!isTransaction}
      closeButton={!isAwaiting}
      onClose={!isAwaiting ? onClose : null}
    >
      {isTransaction ? renderTransaction() : renderRegular()}
    </Modal>
  );
};

export default ConnectionModal;
