import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';
import CancelButton from '../../../components/common/CancelButton/CancelButton';

import { CHAIN_CODES } from '../../../constants/common';
import { ROUTES } from '../../../constants/routes';

import { TransactionItemProps } from '../types';

import { FioWalletDoublet } from '../../../types';

import classes from '../styles/TransactionActionButtons.module.scss';

type Props = {
  fioRequest: TransactionItemProps;
  fioWallet: FioWalletDoublet;
  onCloseModal: () => void;
};

const TransactionActionButtons: React.FC<Props &
  RouteComponentProps> = props => {
  const { history, fioRequest, fioWallet, onCloseModal } = props;

  const isFioChain = fioRequest.content.chain === CHAIN_CODES.FIO;

  const payButtonText = isFioChain ? 'Pay' : 'Enter Payment Details';

  const onRejectClick = () => {
    onCloseModal();
    history.push(ROUTES.REJECT_FIO_REQUEST, {
      fioRequest,
      fioWallet,
    });
  };

  const onPayClick = () => {
    // todo: set path to fio payment page
    const payLink = isFioChain ? '/' : '/';

    history.push(payLink, { fioRequest });
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

export default withRouter(TransactionActionButtons);
