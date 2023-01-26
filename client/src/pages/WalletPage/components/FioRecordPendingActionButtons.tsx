import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import SubmitButton from '../../../components/common/SubmitButton/SubmitButton';

import { ROUTES } from '../../../constants/routes';

import { FioRecordViewDecrypted } from '../types';

import { FioWalletDoublet } from '../../../types';

import classes from '../styles/FioRecordDetailedActionButtons.module.scss';

type Props = {
  fioRecordDecrypted: FioRecordViewDecrypted;
  fioWallet: FioWalletDoublet;
  fioRecordType: string;
  onCloseModal: () => void;
};

const FioRecordPendingActionButtons: React.FC<Props &
  RouteComponentProps> = props => {
  const {
    history,
    fioRecordDecrypted,
    fioWallet,
    fioRecordType,
    onCloseModal,
  } = props;

  const onCancelClick = () => {
    onCloseModal();
    history.push(ROUTES.CANCEL_FIO_REQUEST, {
      fioRecordDecrypted,
      fioWallet,
      fioRecordType,
    });
  };

  return (
    <div className={classes.container}>
      <SubmitButton text="Cancel Request" onClick={onCancelClick} />
    </div>
  );
};

export default withRouter(FioRecordPendingActionButtons);
