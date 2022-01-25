import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';
import CancelButton from '../../../components/common/CancelButton/CancelButton';

import { CHAIN_CODES } from '../../../constants/common';

import { TransactionItemProps } from '../types';

import classes from '../styles/TransactionActionButtons.module.scss';

type Props = {
  fioRequest: TransactionItemProps;
};

const TransactionActionButtons: React.FC<Props &
  RouteComponentProps> = props => {
  const { history, fioRequest } = props;

  const isFioChain = fioRequest.content.chain === CHAIN_CODES.FIO;

  const payButtonText = isFioChain ? 'Pay' : 'Enter Payment Details';

  const onRejectClick = () => {
    // todo: set path to reject page
    history.push('/', { fioRequest });
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
