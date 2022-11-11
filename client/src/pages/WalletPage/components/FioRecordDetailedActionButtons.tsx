import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';
import CancelButton from '../../../components/common/CancelButton/CancelButton';

import { CHAIN_CODES } from '../../../constants/common';
import { ROUTES } from '../../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../../constants/queryParams';

import { FioRecordViewDecrypted } from '../types';

import { FioWalletDoublet } from '../../../types';

import classes from '../styles/FioRecordDetailedActionButtons.module.scss';

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

  const onRejectClick = () => {
    onCloseModal();
    history.push(ROUTES.REJECT_FIO_REQUEST, {
      fioRecordDecrypted,
      fioWallet,
      fioRecordType,
    });
  };

  const onPayClick = () => {
    history.push(
      {
        pathname: ROUTES.SEND,
        search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioWallet.publicKey}`,
      },
      {
        fioWallet,
        fioRecordDecrypted,
      },
    );
  };

  const onEnterPaymentDetails = () => {
    history.push({
      pathname: ROUTES.PAYMENT_DETAILS,
      search: `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${fioWallet.publicKey}&${QUERY_PARAMS_NAMES.FIO_REQUEST_ID}=${fioRecordDecrypted.fioRecord.id}`,
      state: {
        fioWallet,
        fioRecordDecrypted,
      },
    });
  };

  return (
    <div className={classes.container}>
      {isFioChain && (
        <SubmitButton text="Pay" onClick={onPayClick} withBottomMargin={true} />
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
