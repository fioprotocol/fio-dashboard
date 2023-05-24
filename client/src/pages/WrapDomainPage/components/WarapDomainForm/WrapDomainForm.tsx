import React, { useEffect, useState } from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import TextInput, {
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';
import LowBalanceBadge from '../../../../components/Badges/LowBalanceBadge/LowBalanceBadge';
import PriceBadge from '../../../../components/Badges/PriceBadge/PriceBadge';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import { BADGE_TYPES } from '../../../../components/Badge/Badge';

import { formValidation } from './validation';
import MathOp from '../../../../util/math';
import { convertFioPrices, DEFAULT_FEE_PRICES } from '../../../../util/prices';
import useInitializeProviderConnection from '../../../../hooks/externalWalletsConnection/useInitializeProviderConnection';

import apis from '../../../../api';

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
  const [walletAvailableAmount, setWalletAvailableAmount] = useState(0);

  useEffect(() => {
    setUnitedFee(
      convertFioPrices(
        new MathOp(fee?.nativeFio || 0)
          .add(oracleFee?.nativeFio || 0)
          .toNumber(),
        roe,
      ),
    );
  }, [fee, oracleFee, roe]);

  useEffect(() => {
    setWalletAvailableAmount(balance?.available?.nativeFio || 0);
  }, [balance]);

  const handleSubmit = async (values: WrapDomainValues) =>
    props.onSubmit(values);

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
              placeholder="Paste Public Address or Connect a Wallet"
              label="Public Address"
            />

            <p className={classes.transactionTitle}>Transaction Fees</p>
            <PriceBadge
              title="Fees"
              type={BADGE_TYPES.BLACK}
              costFio={unitedFee.fio}
              costUsdc={unitedFee.usdc}
            />

            <div className={classes.additionalSubInfo}>
              <span>Available FIO balance:</span>
              <b>
                {new MathOp(
                  apis.fio.sufToAmount(walletAvailableAmount),
                ).toString()}{' '}
                FIO
              </b>
            </div>

            <LowBalanceBadge
              hasLowBalance={hasLowBalance}
              messageText={`Not enough FIO. Balance: ${apis.fio
                .sufToAmount(fioWallet.available || 0)
                .toFixed(2)} FIO`}
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
