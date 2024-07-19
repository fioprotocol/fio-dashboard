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
  CartItemType,
  NFTTokenDoublet,
  SocialMediaLinkIdProp,
} from '../../../types';

import classes from './ConnectionModal.module.scss';
import {
  CART_ITEM_TYPE,
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
import { PaymentDetailsValues } from '../../../pages/TokensRequestPaymentPage/types';
import { BeforeSubmitValues } from '../../../pages/CheckoutPage/types';
import { PurchaseValues } from '../../PurchaseNow/types';
import { TrxResponse } from '../../../api/fio';

type Props = {
  action: string;
  data: AnyType;
  result?: AnyType;
  fioWalletPublicKey?: string;
  ownerFioPublicKey?: string;
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
    result,
    fioWalletPublicKey,
    ownerFioPublicKey,
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
        fioRequestId,
        from,
        to,
        memo,
      } = data as SendTokensValues;

      const trxResult = result as TrxResponse;

      const isTwoStepSend = fioRequestId || memo;

      return (
        <>
          {isTwoStepSend && (
            <p className={classes.transactionText}>
              Transaction (
              {trxResult ? 'Record Metadata' : 'Transfer FIO Tokens'})&nbsp;
              {trxResult ? 2 : 1} of 2
            </p>
          )}
          {trxResult && isTwoStepSend ? (
            <>
              {fioRequestId && (
                <TransactionInfoBadge title="Request ID">
                  {fioRequestId}
                </TransactionInfoBadge>
              )}
              {from && (
                <TransactionInfoBadge title="Payer FIO Handle">
                  {from}
                </TransactionInfoBadge>
              )}
              {to && (
                <TransactionInfoBadge title="Payee FIO Handle">
                  {to}
                </TransactionInfoBadge>
              )}
              <TransactionInfoBadge title="Payer Public Address">
                {fromPubKey}
              </TransactionInfoBadge>
              <TransactionInfoBadge title="Payee Public Address">
                {toPubKey}
              </TransactionInfoBadge>
              <TransactionInfoBadge title="Amount Requested">
                {amount ?? apis.fio.sufToAmount(nativeAmount)} FIO
              </TransactionInfoBadge>
              <TransactionInfoBadge title="Chain Code">
                FIO
              </TransactionInfoBadge>
              <TransactionInfoBadge title="Token Code">
                FIO
              </TransactionInfoBadge>
              <TransactionInfoBadge title="Status">
                sent_to_blockchain
              </TransactionInfoBadge>
              <TransactionInfoBadge title="Obt ID">
                {trxResult.transaction_id}
              </TransactionInfoBadge>
              <TransactionInfoBadge title="Sign With">
                {fromPubKey}
              </TransactionInfoBadge>
            </>
          ) : (
            <>
              <TransactionInfoBadge title="Payee Pubkey">
                {toPubKey}
              </TransactionInfoBadge>
              <TransactionInfoBadge title="Amount">
                {amount ?? apis.fio.sufToAmount(nativeAmount)} FIO
              </TransactionInfoBadge>
              {fee && (
                <TransactionInfoBadge title="Max Fee">
                  {apis.fio.sufToAmount(fee)} FIO
                </TransactionInfoBadge>
              )}
              <TransactionInfoBadge title="Sign With">
                {fromPubKey}
              </TransactionInfoBadge>
            </>
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
          <TransactionInfoBadge title="Amount">
            {amount ?? apis.fio.sufToAmount(parseFloat(nativeAmount))} FIO
          </TransactionInfoBadge>
          {fee && (
            <TransactionInfoBadge title="Max Fee">
              {apis.fio.sufToAmount(fee)} FIO
            </TransactionInfoBadge>
          )}
          <TransactionInfoBadge title="Sign With">
            {publicKey}
          </TransactionInfoBadge>
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
          <TransactionInfoBadge title="Amount">
            {amount ?? apis.fio.sufToAmount(parseFloat(nativeAmount))} FIO
          </TransactionInfoBadge>
          {fee && (
            <TransactionInfoBadge title="Max Fee">
              {apis.fio.sufToAmount(fee)} FIO
            </TransactionInfoBadge>
          )}
          <TransactionInfoBadge title="Sign With">
            {publicKey}
          </TransactionInfoBadge>
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.WRAP_TOKENS) {
      const { amount, publicAddress, chainCode } = data as WrapTokensValues;

      return (
        <>
          <TransactionInfoBadge title="Amount">
            {amount} FIO
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Chain Code">
            {chainCode}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Public Address">
            {publicAddress}
          </TransactionInfoBadge>
          {oracleFee && (
            <TransactionInfoBadge title="Max Oracle Fee">
              {apis.fio.sufToAmount(oracleFee)} FIO
            </TransactionInfoBadge>
          )}
          {fee && (
            <TransactionInfoBadge title="Max Fee">
              {apis.fio.sufToAmount(fee)} FIO
            </TransactionInfoBadge>
          )}
          {fioWalletPublicKey && (
            <TransactionInfoBadge title="Sign With">
              {fioWalletPublicKey}
            </TransactionInfoBadge>
          )}
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.WRAP_DOMAIN) {
      const { name, publicAddress, chainCode } = data as WrapDomainValues;

      return (
        <>
          <TransactionInfoBadge title="FIO Domain">{name}</TransactionInfoBadge>
          <TransactionInfoBadge title="Chain Code">
            {chainCode}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Public Address">
            {publicAddress}
          </TransactionInfoBadge>
          {oracleFee && (
            <TransactionInfoBadge title="Max Oracle Fee">
              {apis.fio.sufToAmount(oracleFee)} FIO
            </TransactionInfoBadge>
          )}
          {fee && (
            <TransactionInfoBadge title="Max Fee">
              {apis.fio.sufToAmount(fee)} FIO
            </TransactionInfoBadge>
          )}
          {fioWalletPublicKey && (
            <TransactionInfoBadge title="Sign With">
              {fioWalletPublicKey}
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
          {fioWalletPublicKey && (
            <TransactionInfoBadge title="Sign With">
              {fioWalletPublicKey}
            </TransactionInfoBadge>
          )}
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
          {fioWalletPublicKey && (
            <TransactionInfoBadge title="Sign With">
              {fioWalletPublicKey}
            </TransactionInfoBadge>
          )}
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
          {fioWalletPublicKey && (
            <TransactionInfoBadge title="Sign With">
              {fioWalletPublicKey}
            </TransactionInfoBadge>
          )}
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
          <TransactionInfoBadge title="Mappings">
            {Object.keys(socialMediaLinksList).map(key => (
              <Fragment key={key}>
                <b>SOCIALS:{key}:</b>
                {socialMediaLinksList[key as SocialMediaLinkIdProp]}
                <br />
              </Fragment>
            ))}
          </TransactionInfoBadge>
          {fioWalletPublicKey && (
            <TransactionInfoBadge title="Sign With">
              {fioWalletPublicKey}
            </TransactionInfoBadge>
          )}
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
          {fioWalletPublicKey && (
            <TransactionInfoBadge title="Sign With">
              {fioWalletPublicKey}
            </TransactionInfoBadge>
          )}
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
          {fioWalletPublicKey && (
            <TransactionInfoBadge title="Sign With">
              {fioWalletPublicKey}
            </TransactionInfoBadge>
          )}
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.TRANSFER) {
      const {
        name,
        newOwnerPublicKey,
        fioNameType,
      } = data as FioNameTransferValues;

      return (
        <>
          <TransactionInfoBadge
            title={`FIO ${fioNameType === 'domain' ? 'Domain' : 'Handle'}`}
          >
            {name}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="New Owner Pubkey">
            {newOwnerPublicKey}
          </TransactionInfoBadge>
          {fee && (
            <TransactionInfoBadge title="Max Fee">
              {apis.fio.sufToAmount(fee)} FIO
            </TransactionInfoBadge>
          )}
          {fioWalletPublicKey && (
            <TransactionInfoBadge title="Sign With">
              {fioWalletPublicKey}
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
          <TransactionInfoBadge title="Chain Code">
            {chainCode}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Contract Address">
            {contractAddress}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="NFT Token ID">
            {tokenId}
          </TransactionInfoBadge>
          {fioWalletPublicKey && (
            <TransactionInfoBadge title="Sign With">
              {fioWalletPublicKey}
            </TransactionInfoBadge>
          )}
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.REQUEST) {
      const {
        payeeFioAddress,
        payerFioAddress,
        payeeTokenPublicAddress,
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
          <TransactionInfoBadge title="Payee Public Address">
            {payeeTokenPublicAddress}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Amount Requested">
            {amount} {tokenCode}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Chain Code">
            {chainCode}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Token Code">
            {tokenCode}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Sign With">
            {payeeTokenPublicAddress}
          </TransactionInfoBadge>
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.CANCEL_FIO_REQUEST) {
      const { fioRecord } = data as FioRecordViewDecrypted;

      return (
        <>
          <TransactionInfoBadge title="Request ID">
            {fioRecord.id}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Sign With">
            {fioRecord.payeeFioPublicKey}
          </TransactionInfoBadge>
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.SET_VISIBILITY) {
      const { name, publicStatusToSet } = data as FioDomainStatusValues;

      return (
        <>
          <TransactionInfoBadge title="FIO Domain">{name}</TransactionInfoBadge>
          <TransactionInfoBadge title="Make">
            {(publicStatusToSet === 1
              ? DOMAIN_STATUS.PUBLIC
              : DOMAIN_STATUS.PRIVATE
            ).toUpperCase()}
          </TransactionInfoBadge>
          {fee && (
            <TransactionInfoBadge title="Max Fee">
              {apis.fio.sufToAmount(fee)} FIO
            </TransactionInfoBadge>
          )}
          {fioWalletPublicKey && (
            <TransactionInfoBadge title="Sign With">
              {fioWalletPublicKey}
            </TransactionInfoBadge>
          )}
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.REGISTER_ADDRESS_PRIVATE_DOMAIN) {
      const { fioAddressItems } = data as BeforeSubmitValues;

      return (
        <>
          {fioAddressItems.map(it => (
            <TransactionInfoBadge
              key={it.name}
              title="Register FIO Crypto Handle"
            >
              <span>
                <b>FIO Handle</b>: {it.name}
              </span>
              <br />
              <span>
                <b>Owner Pubkey</b>: {it.ownerKey}
              </span>
              <br />
              <span>
                <b>Max Fee</b>: {apis.fio.sufToAmount(fee)} FIO
              </span>
              <br />
              <span>
                <b>Sign With</b>: {it.fioWallet.publicKey}
              </span>
            </TransactionInfoBadge>
          ))}
        </>
      );
    }

    if (action === CONFIRM_LEDGER_ACTIONS.PURCHASE) {
      const { cartItems, prices } = data as PurchaseValues;

      type PurchaseAction = {
        valueName: string;
        value: string;
        name: string;
        type: CartItemType;
        fee: number;
        id: string;
        signInPublicKey: string;
      };

      const purchaseActions: PurchaseAction[] = [];

      cartItems.forEach(
        ({ id, type, domain, address, period, signInFioWallet }) => {
          if (type === CART_ITEM_TYPE.DOMAIN) {
            purchaseActions.push({
              id,
              type,
              fee: prices.nativeFio.domain,
              name: 'Register FIO Domain',
              value: domain,
              valueName: 'FIO Domain',
              signInPublicKey: signInFioWallet?.publicKey,
            });
          }

          if (type === CART_ITEM_TYPE.ADDRESS) {
            purchaseActions.push({
              id,
              type,
              fee: prices.nativeFio.address,
              name: 'Register FIO Crypto Handle',
              value: `${address}@${domain}`,
              valueName: 'FIO Handle',
              signInPublicKey: signInFioWallet?.publicKey,
            });
          }

          if (type === CART_ITEM_TYPE.ADD_BUNDLES) {
            purchaseActions.push({
              id,
              type,
              fee: prices.nativeFio.addBundles,
              name: 'Add Bundles',
              value: `${address}@${domain}`,
              valueName: 'FIO Handle',
              signInPublicKey: signInFioWallet?.publicKey,
            });
          }

          if (type === CART_ITEM_TYPE.DOMAIN_RENEWAL) {
            purchaseActions.push({
              id,
              type,
              fee: prices.nativeFio.renewDomain * +period,
              name: 'Renew FIO Domain',
              value: domain,
              valueName: 'FIO Domain',
              signInPublicKey: signInFioWallet?.publicKey,
            });
          }

          if (type === CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN) {
            purchaseActions.push({
              id: id + domain,
              type: CART_ITEM_TYPE.DOMAIN,
              fee: prices.nativeFio.domain,
              name: 'Register FIO Domain',
              value: domain,
              valueName: 'FIO Domain',
              signInPublicKey: signInFioWallet?.publicKey,
            });
            if (+period > 1) {
              purchaseActions.push({
                id,
                type: CART_ITEM_TYPE.DOMAIN_RENEWAL,
                fee: prices.nativeFio.renewDomain * (+period - 1),
                name: 'Renew FIO Domain',
                value: domain,
                valueName: 'FIO Domain',
                signInPublicKey: signInFioWallet?.publicKey,
              });
            }
            purchaseActions.push({
              id: `${address}@${domain}`,
              type: CART_ITEM_TYPE.ADDRESS,
              fee: prices.nativeFio.address,
              name: 'Register FIO Crypto Handle',
              value: `${address}@${domain}`,
              valueName: 'FIO Handle',
              signInPublicKey: signInFioWallet?.publicKey,
            });
          }
        },
      );

      return (
        <>
          {purchaseActions.map(it => (
            <TransactionInfoBadge key={it.id} title={it.name}>
              <span>
                <b>{it.valueName}</b>: {it.value}
              </span>
              <br />
              {it.type === CART_ITEM_TYPE.ADD_BUNDLES && (
                <>
                  <span>
                    <b>Bundle sets</b>: 1
                  </span>
                  <br />
                </>
              )}
              {ownerFioPublicKey &&
                [
                  CART_ITEM_TYPE.ADDRESS,
                  CART_ITEM_TYPE.DOMAIN,
                  CART_ITEM_TYPE.ADDRESS_WITH_CUSTOM_DOMAIN,
                ].includes(it.type) && (
                  <>
                    <span>
                      <b>Owner Pubkey</b>: {ownerFioPublicKey}
                    </span>
                    <br />
                  </>
                )}
              <span>
                <b>Max Fee</b>: {apis.fio.sufToAmount(it.fee)} FIO
              </span>
              <br />
              {it.signInPublicKey && (
                <span>
                  <b>Sign With</b>: {it.signInPublicKey}
                </span>
              )}
            </TransactionInfoBadge>
          ))}
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
          {fioWalletPublicKey && (
            <TransactionInfoBadge title="Payer Public Address">
              {fioWalletPublicKey}
            </TransactionInfoBadge>
          )}
          <TransactionInfoBadge title="Payee Public Address">
            {payeePublicAddress}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Obt ID">{obtId}</TransactionInfoBadge>
          <TransactionInfoBadge title="Amount Requested">
            {amount} {tokenCode}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Chain Code">
            {chainCode}
          </TransactionInfoBadge>
          <TransactionInfoBadge title="Token Code">
            {tokenCode}
          </TransactionInfoBadge>
          {fioWalletPublicKey && (
            <TransactionInfoBadge title="Sign With">
              {fioWalletPublicKey}
            </TransactionInfoBadge>
          )}
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
          {fioWalletPublicKey && (
            <TransactionInfoBadge title="Sign With">
              {fioWalletPublicKey}
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
