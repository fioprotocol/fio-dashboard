import React, { useEffect, useState } from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { Link } from 'react-router-dom';

import Input, { INPUT_UI_STYLES } from '../../../../components/Input/TextInput';
import { TransactionDetails } from '../../../../components/TransactionDetails/TransactionDetails';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import Dropdown from '../../../../components/Input/Dropdown';
import AmountInput from '../../../../components/Input/AmountInput';
import InfoBadge from '../../../../components/InfoBadge/InfoBadge';
import { Label } from '../../../../components/Input/StaticInputParts';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import { BADGE_TYPES } from '../../../../components/Badge/Badge';
import { ROUTES } from '../../../../constants/routes';
import { BUNDLES_TX_COUNT } from '../../../../constants/fio';
import { QUERY_PARAMS_NAMES } from '../../../../constants/queryParams';

import { formValidation } from './validation';
import MathOp from '../../../../util/math';

import apis from '../../../../api';

import { StakeTokensProps, StakeTokensValues } from '../../types';
import { FioAddressDoublet } from '../../../../types';

import classes from '../../styles/StakeTokensForm.module.scss';

const StakeTokensForm: React.FC<StakeTokensProps> = props => {
  const {
    loading,
    fioAddresses,
    fee,
    initialValues,
    isWalletFioAddressesLoading,
    balance,
    fioWallet,
    proxyList,
    proxyLoading,
  } = props;

  const [walletAvailableAmount, setWalletAvailableAmount] = useState('0');
  const [walletMaxAvailableAmount, setWalletMaxAvailableAmount] = useState<
    string | null
  >(null);

  useEffect(() => {
    setWalletAvailableAmount(balance?.available?.nativeFio || '0');
  }, [balance]);

  useEffect(() => {
    if (!isWalletFioAddressesLoading) {
      if (fioAddresses.length) {
        setWalletMaxAvailableAmount(walletAvailableAmount);
      } else {
        setWalletMaxAvailableAmount(
          new MathOp(fee.nativeFio || 0).gt(walletAvailableAmount)
            ? '0'
            : new MathOp(walletAvailableAmount)
                .sub(fee.nativeFio || 0)
                .toString(),
        );
      }
    }
  }, [
    fee,
    fioAddresses.length,
    isWalletFioAddressesLoading,
    walletAvailableAmount,
  ]);

  // temporary added while fio stake api can't allow accounts without FIO Handles
  const renderFioAddressWarningBadge = () => {
    if (fioAddresses.length) return null;

    return (
      <>
        <Label
          label="FIO Handle for Staking"
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
        />
        <InfoBadge
          className={classes.infoBadge}
          type={BADGE_TYPES.ERROR}
          show={true}
          title="No FIO Handle"
          message={
            <>
              You do not have a FIO handle associated with this wallet. Please
              get one and try again
              <br />
              <br />
              <Link to={ROUTES.FIO_ADDRESSES_SELECTION}>Get FIO Handle</Link>
            </>
          }
        />
      </>
    );
  };

  const renderFioAddressInfoBadge = () => {
    if (fioAddresses.length) return null;

    return renderFioAddressWarningBadge();

    // temporary added while fio stake api can't allow accounts without FIO Handles
    // eslint-disable-next-line no-unreachable
    return (
      <>
        <Label
          label="FIO Handle for Staking"
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
        />
        <InfoBadge
          className={classes.infoBadge}
          type={BADGE_TYPES.INFO}
          show={true}
          title="No Address"
          message={
            <>
              You do not have a FIO handle associated with this wallet. You will
              need to pay a fee to stake your tokens.
              <br />
              <br />
              Want to use a bundle transaction instead of paying fee?{' '}
              <Link to={ROUTES.FIO_ADDRESSES_SELECTION}>Get FIO Handle</Link>
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

        const renderCryptoHandle = () => {
          if (!fioAddresses.length) return null;

          return (
            <>
              {fioAddresses.length > 1 ? (
                <Field
                  name="fioAddress"
                  label="FIO Handle for Staking"
                  component={Dropdown}
                  errorColor={COLOR_TYPE.WARN}
                  placeholder="Select FIO Handle"
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
                  label="FIO Handle for Staking"
                />
              )}
            </>
          );
        };

        const selectedAddress: FioAddressDoublet | undefined | null = fioAddress
          ? fioAddresses.find(({ name }) => name === fioAddress)
          : null;

        const hasLowBalance =
          (walletMaxAvailableAmount === '0' ||
            (!!walletMaxAvailableAmount &&
              new MathOp(apis.fio.amountToSUF(amount)).gt(
                walletMaxAvailableAmount,
              ))) &&
          !isWalletFioAddressesLoading;
        const notEnoughBundles =
          selectedAddress != null
            ? selectedAddress.remaining < BUNDLES_TX_COUNT.STAKE
            : false;
        const submitDisabled =
          formRenderProps.hasValidationErrors ||
          (formRenderProps.hasSubmitErrors &&
            !formRenderProps.modifiedSinceLastSubmit) ||
          formRenderProps.submitting ||
          loading ||
          hasLowBalance ||
          (!!selectedAddress && notEnoughBundles) ||
          isWalletFioAddressesLoading ||
          !fioAddresses.length; // temporary added while fio stake api can't allow accounts without FIO Handles

        return (
          <form
            onSubmit={formRenderProps.handleSubmit}
            className={classes.form}
          >
            <InfoBadge
              className={classes.infoBadge}
              type={BADGE_TYPES.ERROR}
              show={hasLowBalance}
              title="Low Balance"
              message="You do not have enough FIO to stake. Please add more FIO and try again"
            />

            {renderFioAddressInfoBadge()}
            {renderCryptoHandle()}

            <Field
              name="amount"
              label="FIO Stake Amount"
              placeholder="Enter Stake Amount"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={AmountInput}
              availableValue={apis.fio.sufToAmount(walletAvailableAmount)}
              maxValue={
                walletMaxAvailableAmount
                  ? apis.fio.sufToAmount(walletMaxAvailableAmount)
                  : '0'
              }
            />

            <div className={classes.marginPlug} />
            <Field
              name="proxy"
              label="Proxy/Vote Your Tokens"
              description="In order to stake your FIO tokens, you must proxy/vote your
            tokens. Please select a proxy below, or your tokens will be
            auto-proxed on your behalf."
              component={Dropdown}
              errorColor={COLOR_TYPE.WARN}
              placeholder="Select a Proxy"
              options={proxyList.map(proxyItem => ({
                id: proxyItem,
                name: proxyItem,
              }))}
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              isSimple={true}
              isHigh={true}
              isWhite={true}
              loading={proxyLoading}
            />

            <p className={classes.transactionTitle}>Transaction Details</p>
            <InfoBadge
              className={classes.infoBadgeError}
              type={BADGE_TYPES.ERROR}
              show={notEnoughBundles}
              title="No Bundles"
              message={
                <>
                  You do not have any available bundles to use. Please select an
                  address with an available bundle balance, pay the fee below or{' '}
                  <Link
                    to={`${ROUTES.FIO_ADDRESS_ADD_BUNDLES}?${
                      QUERY_PARAMS_NAMES.NAME
                    }=${fioAddress as string}`}
                  >
                    add more bundles
                  </Link>
                  .
                </>
              }
            />
            <TransactionDetails
              feeInFio={fee.nativeFio}
              amountInFio={apis.fio.amountToSUF(amount)}
              bundles={
                selectedAddress && !notEnoughBundles
                  ? {
                      fee: BUNDLES_TX_COUNT.STAKE,
                      remaining: selectedAddress.remaining,
                    }
                  : null
              }
              payWith={{
                walletName: fioWallet.name,
                walletBalances: balance.available,
              }}
            />

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
