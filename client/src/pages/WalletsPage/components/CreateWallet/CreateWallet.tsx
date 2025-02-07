import React, { useCallback, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import CreateWalletModal from '../CreateWalletModal';
import CreateEdgeWallet from './CreateEdgeWallet';
import CreateLedgerWallet from './CreateLedgerWallet';
import { CreateMetamaskWallet } from './CreateMetamaskWallet';

import {
  addWallet,
  resetAddWalletSuccess,
} from '../../../../redux/account/actions';

import { fioWallets as fioWalletsSelector } from '../../../../redux/fio/selectors';
import { addWalletLoading as addWalletLoadingSelector } from '../../../../redux/account/selectors';
import {
  showGenericError as showGenericErrorSelector,
  showPinConfirm as showPinConfirmSelector,
} from '../../../../redux/modal/selectors';
import { walletHasBeenAdded as walletHasBeenAddedSelector } from '../../../../redux/account/selectors';

import { isMetaMask } from '../../../../util/ethereum';

import {
  WALLET_CREATED_FROM,
  DEFAULT_WALLET_OPTIONS,
} from '../../../../constants/common';

import useEffectOnce from '../../../../hooks/general';

import { CreateWalletValues } from '../../types';
import { FioWalletDoublet, NewFioWalletDoublet } from '../../../../types';

type Props = {
  fioWallets: FioWalletDoublet[];
  isAlternativeAccountType: boolean;
  show: boolean;
  onClose: () => void;
  onWalletCreated: () => void;
};

export const CreateWallet: React.FC<Props> = props => {
  const { isAlternativeAccountType, show, onClose, onWalletCreated } = props;

  const addWalletLoading = useSelector(addWalletLoadingSelector);
  const fioWallets = useSelector(fioWalletsSelector);
  const walletHasBeenAdded = useSelector(walletHasBeenAddedSelector);
  const showGenericError = useSelector(showGenericErrorSelector);
  const showPinConfirm = useSelector(showPinConfirmSelector);

  const walletsAmount = fioWallets.length;
  const existingWalletNames = fioWallets.map(fioWallet => fioWallet.name);
  const existingWalletNamesJSON = JSON.stringify(existingWalletNames);

  const [creationType, setCreationType] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [currentValues, setCurrentValues] = useState<CreateWalletValues>({
    name: '',
    ledger: false,
  });
  const dispatch = useDispatch();

  const isMetamaskWalletProvider = isMetaMask() && isAlternativeAccountType;

  useEffect(() => {
    if (show) {
      const parsedExistingWalletNames = JSON.parse(existingWalletNamesJSON);

      const generateUniqueDefaultName = (existingNames: string[]) => {
        const walletsAmount = existingNames.length;
        let newWalletCount = walletsAmount + 1;
        let defaultName = `${DEFAULT_WALLET_OPTIONS.name} ${newWalletCount}`;

        while (existingNames.includes(defaultName)) {
          newWalletCount++;
          defaultName = `${DEFAULT_WALLET_OPTIONS.name} ${newWalletCount}`;
        }

        return defaultName;
      };

      const newDefaultName = generateUniqueDefaultName(
        parsedExistingWalletNames,
      );

      setCurrentValues({
        name: newDefaultName,
        ledger: false,
      });
    }
  }, [existingWalletNamesJSON, show, walletsAmount]);

  useEffect(() => {
    if (walletHasBeenAdded) {
      onWalletCreated();
    }
  }, [onWalletCreated, walletHasBeenAdded]);

  useEffectOnce(() => {
    resetAddWalletSuccess();
  }, []);

  const onCreateSubmit = useCallback(
    (values: CreateWalletValues) => {
      setCurrentValues(values);
      setCreationType(
        values.ledger
          ? WALLET_CREATED_FROM.LEDGER
          : isMetamaskWalletProvider
          ? WALLET_CREATED_FROM.METAMASK
          : WALLET_CREATED_FROM.EDGE,
      );
    },
    [isMetamaskWalletProvider],
  );

  const onWalletDataPrepared = (walletData: NewFioWalletDoublet) => {
    dispatch(addWallet(walletData));
    setCreationType(null);
    setProcessing(false);
  };

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
      {creationType === WALLET_CREATED_FROM.METAMASK ? (
        <CreateMetamaskWallet
          setProcessing={setProcessing}
          values={currentValues}
          onWalletDataPrepared={onWalletDataPrepared}
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
