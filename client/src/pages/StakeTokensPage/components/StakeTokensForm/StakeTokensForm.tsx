import React, { useEffect, useState } from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import Input, { INPUT_UI_STYLES } from '../../../../components/Input/TextInput';
import BundledTransactionBadge from '../../../../components/Badges/BundledTransactionBadge/BundledTransactionBadge';
import PriceBadge from '../../../../components/Badges/PriceBadge/PriceBadge';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import Dropdown from '../../../../components/Input/Dropdown';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import { BADGE_TYPES } from '../../../../components/Badge/Badge';

import { formValidation } from './validation';

import {
  BUNDLES_TX_COUNT,
  STAKE_MIN_VALUE_TO_SAVE,
} from '../../../../constants/fio';

import { StakeTokensProps, StakeTokensValues } from '../../types';
import { FioAddressDoublet } from '../../../../types';

import classes from '../../styles/StakeTokensForm.module.scss';
import StakeAmountInput from '../../../../components/Input/StakeAmountInput';
import InfoBadge from '../../../../components/InfoBadge/InfoBadge';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../constants/routes';
import { Label } from '../../../../components/Input/StaticInputParts';
import apis from '../../../../api';

const StakeTokensForm: React.FC<StakeTokensProps> = props => {
  const { loading, fioWallet, fioAddresses, roe, fee, initialValues } = props;

  const [walletMaxAvailableAmount, setWalletMaxAvailableAmount] = useState('0');
  const [
    walletMaxAllowedAvailableAmount,
    setWalletMaxAllowedAvailableAmount,
  ] = useState('0');

  useEffect(() => {
    setWalletMaxAvailableAmount(
      apis.fio.sufToAmount(fioWallet.available || 0).toFixed(2),
    );
  }, [fioWallet]);

  useEffect(() => {
    setWalletMaxAllowedAvailableAmount(
      !fioAddresses.length
        ? STAKE_MIN_VALUE_TO_SAVE > Number(walletMaxAvailableAmount)
          ? '0'
          : Number(walletMaxAvailableAmount) - STAKE_MIN_VALUE_TO_SAVE + ''
        : walletMaxAvailableAmount,
    );
  }, [walletMaxAvailableAmount, fioAddresses]);

  const renderFIOAddressInfoBadge = () => {
    if (fioAddresses.length) return null;

    return (
      <>
        <Label
          label="FIO Crypto Handle for Staking"
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
        />
        <InfoBadge
          containerClassname={classes.infoBadge}
          type={BADGE_TYPES.INFO}
          show={true}
          title="No Address"
          message={
            <>
              You do not have an address associated with this wallet. You will
              need to pay a fee to stake your tokens.
              <br />
              <br />
              Want to use a bundle transaction instead of paying fee?{' '}
              <Link to={ROUTES.FIO_ADDRESSES_SELECTION}>Get Fio Address</Link>
            </>
          }
        />
      </>
    );
  };

  const handleSubmit = async (values: StakeTokensValues) => {
    return props.onSubmit(values);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      validate={formValidation.validateForm}
      initialValues={initialValues}
    >
      {(formRenderProps: FormRenderProps) => {
        const {
          values: { amount, fioAddress },
        } = formRenderProps;

        const renderUser = () => {
          if (!fioAddresses.length) return null;

          return (
            <>
              {fioAddresses.length > 1 ? (
                <Field
                  name="fioAddress"
                  label="FIO Crypto Handle for Staking"
                  component={Dropdown}
                  errorColor={COLOR_TYPE.WARN}
                  placeholder="Select FIO Crypto Handle"
                  options={fioAddresses.map(({ name }) => ({
                    id: name,
                    name,
                  }))}
                  uiType={INPUT_UI_STYLES.BLACK_WHITE}
                  isSimple={true}
                  isHigh={true}
                  isWhite={true}
                />
              ) : (
                <Field
                  name="fioAddress"
                  type="text"
                  uiType={INPUT_UI_STYLES.BLACK_WHITE}
                  errorColor={COLOR_TYPE.WARN}
                  component={Input}
                  disabled={true}
                  label="FIO Crypto Handle for Staking"
                />
              )}
            </>
          );
        };

        const selectedAddress: FioAddressDoublet | null = fioAddress
          ? fioAddresses.find(({ name }) => name === fioAddress)
          : null;

        const hasLowBalance =
          Number(walletMaxAllowedAvailableAmount) === 0 ||
          Number(amount) > Number(walletMaxAllowedAvailableAmount);
        const notEnoughBundles =
          selectedAddress != null
            ? selectedAddress.remaining < BUNDLES_TX_COUNT.RECORD_OBT_DATA
            : false;
        const submitDisabled =
          formRenderProps.hasValidationErrors ||
          (formRenderProps.hasSubmitErrors &&
            !formRenderProps.modifiedSinceLastSubmit) ||
          formRenderProps.submitting ||
          loading ||
          hasLowBalance ||
          (selectedAddress && notEnoughBundles) ||
          !fee.nativeFio;

        return (
          <form
            onSubmit={formRenderProps.handleSubmit}
            className={classes.form}
          >
            <InfoBadge
              containerClassname={classes.infoBadge}
              type={BADGE_TYPES.ERROR}
              show={hasLowBalance}
              title="Low Balance"
              message="You do not have enough FIO to stake. Please add more FIO and try again"
            />

            {renderFIOAddressInfoBadge()}
            {renderUser()}

            <Field
              name="amount"
              placeholder="Enter Stake Amount"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={StakeAmountInput}
              hasFioAddress={fioAddresses.length}
              maxValueLabel="Available FIO Balance: "
              maxValue={walletMaxAvailableAmount}
              maxAllowedValue={walletMaxAllowedAvailableAmount}
              maxValueTitle="Available FIO Balance"
              roe={roe}
              label="FIO Stake Amount"
            />

            <p className={classes.transactionTitle}>Transaction cost</p>
            {!selectedAddress ? (
              <PriceBadge
                title="Fees"
                type={BADGE_TYPES.BLACK}
                costNativeFio={fee.nativeFio}
                costFio={fee.fio}
                costUsdc={fee.usdc}
              />
            ) : (
              <>
                <InfoBadge
                  type={BADGE_TYPES.ERROR}
                  show={notEnoughBundles}
                  title="No Bundles"
                  message={
                    <>
                      You do not have any available bundles to use. Please
                      select an address with an available bundle balance, pay
                      the fee below or{' '}
                      <Link to={ROUTES.HOME}>add more bundles</Link>.
                    </>
                  }
                />
                <BundledTransactionBadge
                  bundles={BUNDLES_TX_COUNT.RECORD_OBT_DATA}
                  remaining={selectedAddress.remaining}
                />
              </>
            )}

            <SubmitButton
              text="Stake FIO Tokens"
              disabled={submitDisabled}
              loading={loading}
              withTopMargin={true}
            />
          </form>
        );
      }}
    </Form>
  );
};

export default StakeTokensForm;
