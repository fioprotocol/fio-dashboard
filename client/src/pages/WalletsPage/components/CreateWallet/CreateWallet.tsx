import React, { useCallback, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import CreateWalletModal from '../CreateWalletModal';
import CreateEdgeWallet from './CreateEdgeWallet';
import CreateLedgerWallet from './CreateLedgerWallet';

import { addWallet } from '../../../../redux/account/actions';

import { fioWallets as fioWalletsSelector } from '../../../../redux/fio/selectors';
import { addWalletLoading as addWalletLoadingSelector } from '../../../../redux/account/selectors';
import {
  showGenericError as showGenericErrorSelector,
  showPinConfirm as showPinConfirmSelector,
} from '../../../../redux/modal/selectors';
import { isWalletCreated as isWalletCreatedSelector } from '../../../../redux/account/selectors';

import {
  WALLET_CREATED_FROM,
  DEFAULT_WALLET_OPTIONS,
} from '../../../../constants/common';

import { CreateWalletValues } from '../../types';
import { NewFioWalletDoublet } from '../../../../types';

type Props = {
  show: boolean;
  onClose: () => void;
  onWalletCreated: () => void;
};

export const CreateWallet: React.FC<Props> = props => {
  const { show, onClose, onWalletCreated } = props;

  const addWalletLoading = useSelector(addWalletLoadingSelector);
  const fioWallets = useSelector(fioWalletsSelector);
  const isWalletCreated = useSelector(isWalletCreatedSelector);
  const showGenericError = useSelector(showGenericErrorSelector);
  const showPinConfirm = useSelector(showPinConfirmSelector);

  const walletsAmount = fioWallets.length;

  const [creationType, setCreationType] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [currentValues, setCurrentValues] = useState<CreateWalletValues>({
    name: '',
    ledger: false,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      const newWalletCount = walletsAmount + 1;
      const defaultName = `${DEFAULT_WALLET_OPTIONS.name} ${newWalletCount}`;

      setCurrentValues({
        name: defaultName,
        ledger: false,
      });
    }
  }, [show, walletsAmount]);

  useEffect(() => {
    if (isWalletCreated && !addWalletLoading && !showGenericError) {
      onWalletCreated();
      setProcessing(false);
    }
  }, [isWalletCreated, addWalletLoading, showGenericError, onWalletCreated]);

  const onCreateSubmit = useCallback((values: CreateWalletValues) => {
    setCurrentValues(values);
    setCreationType(
      values.ledger ? WALLET_CREATED_FROM.LEDGER : WALLET_CREATED_FROM.EDGE,
    );
  }, []);

  const onWalletDataPrepared = useCallback(
    (walletData: NewFioWalletDoublet) => {
      dispatch(addWallet(walletData));
      setCreationType(null);
    },
    [dispatch],
  );

  const onOptionCancel = useCallback(() => {
    setCreationType(null);
    setProcessing(false);
  }, []);

  const onModalClose = useCallback(() => {
    if (!processing && !addWalletLoading) {
      onClose();
    }
  }, [addWalletLoading, onClose, processing]);

  return (
    <>
      {creationType === WALLET_CREATED_FROM.EDGE ? (
        <CreateEdgeWallet
          setProcessing={setProcessing}
          processing={processing}
          values={currentValues}
          onWalletDataPrepared={onWalletDataPrepared}
          onOptionCancel={onOptionCancel}
          {...props}
        />
      ) : null}
      {creationType === WALLET_CREATED_FROM.LEDGER ? (
        <CreateLedgerWallet
          fioWallets={fioWallets}
          setProcessing={setProcessing}
          values={currentValues}
          onWalletDataPrepared={onWalletDataPrepared}
          onOptionCancel={onOptionCancel}
          {...props}
        />
      ) : null}
      <CreateWalletModal
        show={
          show &&
          !showPinConfirm &&
          !showGenericError &&
          creationType !== WALLET_CREATED_FROM.LEDGER
        }
        onClose={onModalClose}
        loading={processing || addWalletLoading}
        onSubmit={onCreateSubmit}
        initialValues={currentValues}
      />
    </>
  );
};
