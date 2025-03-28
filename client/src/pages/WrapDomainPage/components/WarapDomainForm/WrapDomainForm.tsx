import React, { useEffect, useState } from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { isMobile } from 'react-device-detect';

import TextInput, {
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';
import LowBalanceBadge from '../../../../components/Badges/LowBalanceBadge/LowBalanceBadge';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import { TransactionDetails } from '../../../../components/TransactionDetails/TransactionDetails';

import apis from '../../../../api';

import { formValidation } from './validation';
import MathOp from '../../../../util/math';
import { convertFioPrices, DEFAULT_FEE_PRICES } from '../../../../util/prices';
import useInitializeProviderConnection from '../../../../hooks/externalWalletsConnection/useInitializeProviderConnection';

import { WrapDomainFormProps, WrapDomainValues } from '../../types';
import { FeePrice } from '../../../../types';

import classes from '../../styles/WrapDomainForm.module.scss';

const WrapDomainForm: React.FC<WrapDomainFormProps> = props => {
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

  useEffect(() => {
    setUnitedFee(
      convertFioPrices(
        new MathOp(fee?.nativeFio || 0)
          .add(oracleFee?.nativeFio || 0)
          .toString(),
        roe,
      ),
    );
  }, [fee, oracleFee, roe]);

  const handleSubmit = async (values: WrapDomainValues) =>
    props.onSubmit(values);

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
        const hasLowBalance = new MathOp(unitedFee.nativeFio || 0).gt(
          balance.available.nativeFio || 0,
        );

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
              connectWalletProps={providerData}
              showConnectWalletButton
              connectWalletModalText="Please connect your wallet in order to wrap and receive your wrapped FIO domain."
              showPasteButton
              placeholder={publicAddressPlaceholder}
              label="Public Address"
            />

            <p className={classes.transactionTitle}>Transaction Details</p>
            <TransactionDetails
              feeInFio={unitedFee.nativeFio}
              payWith={{
                walletName: fioWallet.name,
                walletBalances: balance?.available,
              }}
            />

            <LowBalanceBadge
              hasLowBalance={hasLowBalance}
              messageText={`Not enough FIO. Balance: ${apis.fio.sufToAmount(
                fioWallet.available || 0,
              )}`}
            />

            <SubmitButton
              text="Wrap FIO Domain"
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

export default WrapDomainForm;
