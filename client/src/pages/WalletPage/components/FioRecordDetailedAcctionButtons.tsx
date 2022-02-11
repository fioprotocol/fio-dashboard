import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';
import CancelButton from '../../../components/common/CancelButton/CancelButton';

import { CHAIN_CODES } from '../../../constants/common';
import { ROUTES } from '../../../constants/routes';

import { putParamsToUrl } from '../../../utils';

import { FioRecordViewDecrypted } from '../types';

import { FioWalletDoublet } from '../../../types';

import classes from '../styles/FioRecordDetailedAcctionButtons.module.scss';

type Props = {
  fioRecordDecrypted: FioRecordViewDecrypted;
  fioWallet: FioWalletDoublet;
  fioRecordType: string;
  onCloseModal: () => void;
};

const FioRecordDetailedActionButtons: React.FC<Props &
  RouteComponentProps> = props => {
  const {
    history,
    fioRecordDecrypted,
    fioWallet,
    fioRecordType,
    onCloseModal,
  } = props;

  const isFioChain =
    fioRecordDecrypted?.fioDecryptedContent?.chainCode === CHAIN_CODES.FIO;

  const payButtonText = isFioChain ? 'Pay' : 'Enter Payment Details';

  const onRejectClick = () => {
    onCloseModal();
    history.push(ROUTES.REJECT_FIO_REQUEST, {
      fioRecordDecrypted,
      fioWallet,
      fioRecordType,
    });
  };

  const onPayClick = () => {
    const payLink = putParamsToUrl(ROUTES.SEND, {
      publicKey: fioWallet.publicKey,
    });

    history.push(payLink, {
      fioWallet,
      fioRecordDecrypted,
    });
  };

  const onEnterPaymentDetails = () => {
    const paymentDetailsLink = putParamsToUrl(ROUTES.PAYMENT_DETAILS, {
      publicKey: fioWallet.publicKey,
      fioRequestId: fioRecordDecrypted.fioRecord.id + '',
    });

    history.push(paymentDetailsLink, {
      fioWallet,
      fioRecordDecrypted,
    });
  };

  return (
    <div className={classes.container}>
      {isFioChain && (
        <SubmitButton
          text={payButtonText}
          onClick={onPayClick}
          withBottomMargin={true}
        />
      )}
      <SubmitButton
        text="Enter Payment Details"
        onClick={onEnterPaymentDetails}
        withBottomMargin={true}
      />
      <CancelButton text="Reject" onClick={onRejectClick} isBlue={true} />
    </div>
  );
};

export default withRouter(FioRecordDetailedActionButtons);
