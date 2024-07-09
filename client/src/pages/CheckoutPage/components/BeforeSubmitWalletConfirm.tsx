import React, { useEffect, useMemo, useRef, useState } from 'react';

import WalletAction from '../../../components/WalletAction/WalletAction';
import BeforeSubmitEdgeWallet from './BeforeSubmitEdgeWallet';
import { BeforeSubmitMetamaskWallet } from './BeforeSubmitMetamaskWallet';

import BeforeSubmitLedgerWallet from './BeforeSubmitLedgerWallet';

import {
  CONFIRM_PIN_ACTIONS,
  WALLET_CREATED_FROM,
} from '../../../constants/common';

import {
  BeforeSubmitData,
  BeforeSubmitProps,
  BeforeSubmitValues,
  SignFioAddressItem,
} from '../types';
import { FioWalletDoublet } from '../../../types';

const BeforeSubmitWalletConfirm: React.FC<BeforeSubmitProps> = props => {
  const {
    fioWallet,
    fee,
    onCancel,
    onSuccess: onProcessingEnd,
    submitData,
    processing,
    setProcessing,
  } = props;

  const { signInValuesGroup, onSuccess } = useMultipleWalletAction(
    fioWallet,
    submitData,
    onProcessingEnd,
  );

  return (
    <>
      <WalletAction
        fioWallet={signInValuesGroup?.signInFioWallet}
        fee={fee}
        onCancel={onCancel}
        onSuccess={onSuccess}
        submitData={signInValuesGroup?.submitData}
        processing={processing}
        setProcessing={setProcessing}
        action={CONFIRM_PIN_ACTIONS.REGISTER_ADDRESS_PRIVATE_DOMAIN}
        FioActionWallet={BeforeSubmitEdgeWallet}
        LedgerActionWallet={BeforeSubmitLedgerWallet}
        MetamaskActionWallet={BeforeSubmitMetamaskWallet}
      />
    </>
  );
};

type GroupedBeforeSubmitValues = {
  signInFioWallet: FioWalletDoublet;
  submitData: BeforeSubmitValues;
};

const WALLET_TYPE_SIGN_IN_ORDER = [
  WALLET_CREATED_FROM.EDGE,
  WALLET_CREATED_FROM.METAMASK,
  WALLET_CREATED_FROM.LEDGER,
  WALLET_CREATED_FROM.WITHOUT_REGISTRATION,
];

const useMultipleWalletAction = (
  fioWallet: FioWalletDoublet,
  submitData?: BeforeSubmitValues,
  onCollectedSuccess?: (results: BeforeSubmitData) => void,
) => {
  const onCollectedSuccessRef = useRef(onCollectedSuccess);
  onCollectedSuccessRef.current = onCollectedSuccess;

  const [result, setResult] = useState<BeforeSubmitData>({});
  const [groupedBeforeSubmitValues, setGroupedBeforeSubmitValues] = useState<
    GroupedBeforeSubmitValues[]
  >([]);

  useEffect(() => {
    if (!submitData) {
      return;
    }

    const { fioAddressItems } = submitData;

    setResult({});

    if (fioAddressItems.length === 0) {
      setGroupedBeforeSubmitValues([]);
      return;
    }

    const result: GroupedBeforeSubmitValues[] = [];

    fioAddressItems.forEach((fioAddressItem: SignFioAddressItem) => {
      const signInFioWallet = fioAddressItem.fioWallet;
      let group = result.find(
        it => it.signInFioWallet.publicKey === signInFioWallet.publicKey,
      );

      if (!group) {
        group = {
          signInFioWallet,
          submitData: { fioAddressItems: [] },
        };
        result.push(group);
      }

      group.submitData.fioAddressItems.push(fioAddressItem);
    });

    setResult({});
    setGroupedBeforeSubmitValues(result);
  }, [fioWallet, submitData]);

  useEffect(() => {
    if (
      groupedBeforeSubmitValues.length === 0 &&
      Object.keys(result).length > 0
    ) {
      onCollectedSuccessRef.current?.(result);
    }
  }, [groupedBeforeSubmitValues, result]);

  const onSuccess = (data: BeforeSubmitData) => {
    setGroupedBeforeSubmitValues(groupedBeforeSubmitValues.slice(1));
    setResult(result => ({ ...result, ...data }));
  };

  const sortedGroupedBeforeSubmitValues = useMemo(() => {
    const groupedBeforeSubmitValuesToSort = [...groupedBeforeSubmitValues];

    groupedBeforeSubmitValuesToSort.sort((g1, g2) => {
      const g1Priority = WALLET_TYPE_SIGN_IN_ORDER.indexOf(
        g1.signInFioWallet.from,
      );
      const g2Priority = WALLET_TYPE_SIGN_IN_ORDER.indexOf(
        g2.signInFioWallet.from,
      );
      return g1Priority - g2Priority;
    });

    return groupedBeforeSubmitValuesToSort;
  }, [groupedBeforeSubmitValues]);

  const [signInValuesGroup] = sortedGroupedBeforeSubmitValues;

  return { onSuccess, signInValuesGroup };
};

export default BeforeSubmitWalletConfirm;
