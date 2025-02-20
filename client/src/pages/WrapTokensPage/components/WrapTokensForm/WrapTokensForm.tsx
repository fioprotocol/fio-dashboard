import React, { useEffect, useState } from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { isMobile } from 'react-device-detect';

import TextInput, {
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';
import LowBalanceBadge from '../../../../components/Badges/LowBalanceBadge/LowBalanceBadge';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import AmountInput from '../../../../components/Input/AmountInput';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import { TransactionDetails } from '../../../../components/TransactionDetails/TransactionDetails';

import { formValidation } from './validation';
import { useWalletBalances } from '../../../../util/hooks';
import MathOp from '../../../../util/math';
import { convertFioPrices, DEFAULT_FEE_PRICES } from '../../../../util/prices';
import useInitializeProviderConnection from '../../../../hooks/externalWalletsConnection/useInitializeProviderConnection';

import apis from '../../../../api';

import { WrapTokensFormProps, WrapTokensValues } from '../../types';
import { FeePrice } from '../../../../types';

import classes from '../../styles/WrapTokensForm.module.scss';

const WrapTokensForm: React.FC<WrapTokensFormProps> = props => {
  const {
    loading,
    fioWallet,
    fee,
    oracleFee,
    roe,
    initialValues,
    balance,
  } = props;

  const providerData = useInitializeProviderConnection();

  const [unitedFee, setUnitedFee] = useState<FeePrice>(DEFAULT_FEE_PRICES);
  const [walletAvailableAmount, setWalletAvailableAmount] = useState('0');
  const [walletMaxAvailableAmount, setWalletMaxAvailableAmount] = useState<
    string | null
  >(null);

  useEffect(() => {
    setUnitedFee(
      convertFioPrices(
        new MathOp(fee.nativeFio || 0).add(oracleFee.nativeFio).toString(),
        roe,
      ),
    );
  }, [fee, oracleFee, roe]);

  useEffect(() => {
    setWalletAvailableAmount(balance?.available?.nativeFio || '0');
  }, [balance]);

  useEffect(() => {
    setWalletMaxAvailableAmount(
      new MathOp(unitedFee.nativeFio || 0).gt(walletAvailableAmount)
        ? '0'
        : new MathOp(walletAvailableAmount)
            .sub(unitedFee.nativeFio || 0)
            .toString(),
    );
  }, [walletAvailableAmount, unitedFee]);

  const handleSubmit = async (values: WrapTokensValues) =>
    props.onSubmit(values);

  const walletBalances = useWalletBalances(fioWallet.publicKey);

  const publicAddressPlaceholder = isMobile
    ? 'Paste Address or Connect'
    : 'Paste Public Address or Connect a Wallet';

  return (
    <Form
      onSubmit={handleSubmit}
      validate={formValidation.validateForm}
      initialValues={initialValues}
    >
      {(formRenderProps: FormRenderProps) => {
        const {
          values: { amount },
        } = formRenderProps;

        const hasLowBalance = new MathOp(unitedFee.nativeFio || 0)
          .add(apis.fio.amountToSUF(amount))
          .gt(walletBalances.available.nativeFio || 0);

        const submitDisabled =
          formRenderProps.hasValidationErrors ||
          (formRenderProps.hasSubmitErrors &&
            !formRenderProps.modifiedSinceLastSubmit) ||
          formRenderProps.submitting ||
          loading ||
          hasLowBalance ||
          !unitedFee.nativeFio;

        return (
          <form
            onSubmit={formRenderProps.handleSubmit}
            className={classes.form}
          >
            <Field
              name="publicAddress"
              type="text"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={TextInput}
              showConnectWalletButton
              connectWalletProps={providerData}
              connectWalletModalText="Please connect your wallet in order to wrap and receive your FIO tokens."
              showPasteButton
              placeholder={publicAddressPlaceholder}
              label="Public Address"
            />

            <Field
              name="amount"
              label="FIO Wrap Amount"
              placeholder="Enter Wrap Amount"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={AmountInput}
              showMaxInfoBadge={false}
              availableValue={apis.fio.sufToAmount(walletAvailableAmount)}
              maxValue={
                walletMaxAvailableAmount
                  ? apis.fio.sufToAmount(walletMaxAvailableAmount)
                  : '0'
              }
            />

            <p className={classes.transactionTitle}>Transaction Details</p>
            <TransactionDetails
              feeInFio={unitedFee.nativeFio}
              amountInFio={apis.fio.amountToSUF(amount)}
            />
            <LowBalanceBadge
              hasLowBalance={hasLowBalance}
              messageText={`Not enough FIO. Balance: ${apis.fio.sufToAmount(
                fioWallet.available || 0,
              )}`}
            />

            <SubmitButton
              text="Wrap FIO Tokens"
              disabled={submitDisabled}
              loading={loading || formRenderProps.submitting}
              withTopMargin={true}
            />
          </form>
        );
      }}
    </Form>
  );
};

export default WrapTokensForm;
