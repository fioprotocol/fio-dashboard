import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';
import CancelButton from '../../../components/common/CancelButton/CancelButton';

import { CHAIN_CODES } from '../../../constants/common';
import { ROUTES } from '../../../constants/routes';

import { FioRecordViewDecrypted } from '../types';

import { FioWalletDoublet } from '../../../types';

import classes from '../styles/FioDataDetailedActionButtons.module.scss';

type Props = {
  fioRecordDecrypted: FioRecordViewDecrypted;
  fioWallet: FioWalletDoublet;
  fioRecordType: string;
  onCloseModal: () => void;
};

const FioDataDetailedActionButtons: React.FC<Props &
  RouteComponentProps> = props => {
  const {
    history,
    fioRecordDecrypted,
    fioWallet,
    fioRecordType,
    onCloseModal,
  } = props;

  const isFioChain =
    fioRecordDecrypted?.fioDecryptedContent?.chain === CHAIN_CODES.FIO;

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
    // todo: set path to fio payment page
    const payLink = isFioChain ? '/' : '/';

    history.push(payLink, { fioRecordDecrypted });
  };

  return (
    <div className={classes.container}>
      <SubmitButton
        text={payButtonText}
        onClick={onPayClick}
        withBottomMargin={true}
      />
      <CancelButton text="Reject" onClick={onRejectClick} isBlue={true} />
    </div>
  );
};

export default withRouter(FioDataDetailedActionButtons);
