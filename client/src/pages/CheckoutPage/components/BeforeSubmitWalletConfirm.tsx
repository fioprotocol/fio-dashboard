import React, { useEffect, useRef, useState } from 'react';

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
import { AnyType, FioWalletDoublet } from '../../../types';

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

  const {
    groupedBeforeSubmitValues,
    signInValuesGroup,
    onSuccess,
  } = useMultipleWalletAction({
    fioWallet,
    submitData,
    onCollectedSuccess: onProcessingEnd,
  });

  const handlePartOfSubmitDataSuccess = (data: AnyType) => {
    if (groupedBeforeSubmitValues.length > 1) {
      setProcessing(false);
    }
    onSuccess(data);
  };

  return (
    <>
      <WalletAction
        fioWallet={signInValuesGroup?.signInFioWallet}
        fee={fee}
        onCancel={onCancel}
        onSuccess={handlePartOfSubmitDataSuccess}
        groupedBeforeSubmitValues={groupedBeforeSubmitValues}
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

export type GroupedBeforeSubmitValues = {
  signInFioWallet: FioWalletDoublet;
  submitData: BeforeSubmitValues;
};

const WALLET_TYPE_SIGN_IN_ORDER = [
  WALLET_CREATED_FROM.EDGE,
  WALLET_CREATED_FROM.METAMASK,
  WALLET_CREATED_FROM.LEDGER,
  WALLET_CREATED_FROM.WITHOUT_REGISTRATION,
];

type MultipleWalletActionHookProps = {
  fioWallet: FioWalletDoublet;
  submitData?: BeforeSubmitValues;
  onCollectedSuccess?: (results: BeforeSubmitData) => void;
};

const useMultipleWalletAction = ({
  fioWallet,
  submitData,
  onCollectedSuccess,
}: MultipleWalletActionHookProps) => {
  const onCollectedSuccessRef = useRef(onCollectedSuccess);
  onCollectedSuccessRef.current = onCollectedSuccess;

  const [result, setResult] = useState<BeforeSubmitData>({});
  const [groupedBeforeSubmitValues, setGroupedBeforeSubmitValues] = useState<
    GroupedBeforeSubmitValues[]
  >([]);

  useEffect(() => {
    if (!submitData) {
      setResult({});
      setGroupedBeforeSubmitValues([]);
      return;
    }

    const { fioAddressItems } = submitData;

    if (fioAddressItems.length === 0) {
      setResult({});
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

    result.sort((g1, g2) => {
      const g1Priority = WALLET_TYPE_SIGN_IN_ORDER.indexOf(
        g1.signInFioWallet.from,
      );
      const g2Priority = WALLET_TYPE_SIGN_IN_ORDER.indexOf(
        g2.signInFioWallet.from,
      );
      return g1Priority - g2Priority;
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
    const registeredFioAddressItems = Object.keys(data);

    setResult(result => ({ ...result, ...data }));
    setGroupedBeforeSubmitValues(groupedBeforeSubmitValues =>
      groupedBeforeSubmitValues
        .map(group => ({
          ...group,
          submitData: {
            ...group.submitData,
            fioAddressItems: group.submitData.fioAddressItems.filter(
              fioAddressItem =>
                !registeredFioAddressItems.includes(fioAddressItem.name),
            ),
          },
        }))
        .filter(group => group.submitData.fioAddressItems.length > 0),
    );
  };

  const [signInValuesGroup] = groupedBeforeSubmitValues;

  return { onSuccess, groupedBeforeSubmitValues, signInValuesGroup };
};

export default BeforeSubmitWalletConfirm;
