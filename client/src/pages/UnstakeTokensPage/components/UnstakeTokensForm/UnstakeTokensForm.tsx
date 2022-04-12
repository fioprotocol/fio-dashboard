import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { Link } from 'react-router-dom';

import Input, { INPUT_UI_STYLES } from '../../../../components/Input/TextInput';
import BundledTransactionBadge from '../../../../components/Badges/BundledTransactionBadge/BundledTransactionBadge';
import PriceBadge from '../../../../components/Badges/PriceBadge/PriceBadge';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import Dropdown from '../../../../components/Input/Dropdown';
import AmountInput from '../../../../components/Input/AmountInput';
import InfoBadge from '../../../../components/InfoBadge/InfoBadge';
import { Label } from '../../../../components/Input/StaticInputParts';
import LowBalanceBadge from '../../../../components/Badges/LowBalanceBadge/LowBalanceBadge';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import { BADGE_TYPES } from '../../../../components/Badge/Badge';
import { ROUTES } from '../../../../constants/routes';
import { BUNDLES_TX_COUNT } from '../../../../constants/fio';

import { formValidation } from './validation';
import MathOp from '../../../../util/math';

import apis from '../../../../api';

import { UnstakeTokensProps, StakeTokensValues } from '../../types';
import { FioAddressDoublet } from '../../../../types';

import classes from '../../../StakeTokensPage/styles/StakeTokensForm.module.scss';

const UnstakeTokensForm: React.FC<UnstakeTokensProps> = props => {
  const { loading, fioAddresses, fee, initialValues, balance } = props;

  const walletStakedTokens = apis.fio.sufToAmount(
    balance?.staked?.nativeFio || 0,
  );
  const walletAvailableTokens = balance?.available?.nativeFio || 0;

  // temporary added while fio stake api can't allow accounts without crypto handles
  const renderFioAddressWarningBadge = () => {
    if (fioAddresses.length) return null;

    return (
      <>
        <Label
          label="FIO Crypto Handle for Unstaking"
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
        />
        <InfoBadge
          className={classes.infoBadge}
          type={BADGE_TYPES.WARNING}
          show={true}
          title="No Crypto Handle"
          message={
            <>
              You do not have a crypto handle associated with this wallet.
              Please get one and try again
              <br />
              <br />
              <Link to={ROUTES.FIO_ADDRESSES_SELECTION}>
                Get Fio Crypto Handle
              </Link>
            </>
          }
        />
      </>
    );
  };

  const renderFioAddressInfoBadge = () => {
    if (fioAddresses.length) return null;

    return renderFioAddressWarningBadge();
    // temporary added while fio stake api can't allow accounts without crypto handles
    // eslint-disable-next-line no-unreachable
    return (
      <>
        <Label
          label="FIO Crypto Handle for Unstaking"
          uiType={INPUT_UI_STYLES.BLACK_WHITE}
        />
        <InfoBadge
          className={classes.infoBadge}
          type={BADGE_TYPES.INFO}
          show={true}
          title="No Crypto Handle"
          message={
            <>
              You do not have a crypto handle associated with this wallet. You
              will need to pay a fee to stake your tokens.
              <br />
              <br />
              Want to use a bundle transaction instead of paying fee?{' '}
              <Link to={ROUTES.FIO_ADDRESSES_SELECTION}>
                Get Fio Crypto Handle
              </Link>
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
                  label="FIO Crypto Handle for Unstaking"
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
                  label="FIO Crypto Handle for Unstaking"
                />
              )}
            </>
          );
        };

        const selectedAddress: FioAddressDoublet | undefined | null = fioAddress
          ? fioAddresses.find(({ name }) => name === fioAddress)
          : null;

        const notEnoughStaked = new MathOp(amount).gt(walletStakedTokens);
        const hasLowBalance = new MathOp(fee.nativeFio || 0).gt(
          walletAvailableTokens,
        );
        const notEnoughBundles =
          selectedAddress != null
            ? selectedAddress.remaining < BUNDLES_TX_COUNT.UNSTAKE
            : false;
        const submitDisabled =
          formRenderProps.hasValidationErrors ||
          (formRenderProps.hasSubmitErrors &&
            !formRenderProps.modifiedSinceLastSubmit) ||
          formRenderProps.submitting ||
          loading ||
          hasLowBalance ||
          notEnoughStaked ||
          (!!selectedAddress && notEnoughBundles) ||
          !fioAddresses.length; // temporary added while fio stake api can't allow accounts without crypto handles

        return (
          <form
            onSubmit={formRenderProps.handleSubmit}
            className={classes.form}
          >
            <InfoBadge
              className={classes.infoBadge}
              type={BADGE_TYPES.INFO}
              show={true}
              title="Unstaking Reward Amount"
              message="The rewards amount of FIO Tokens will be locked for 7 days before it can be transferred or staked again."
            />

            {renderFioAddressInfoBadge()}
            {renderCryptoHandle()}

            <Field
              name="amount"
              placeholder="Enter Amount to Unstake"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={AmountInput}
              availableValue={new MathOp(walletStakedTokens).toString()}
              availableTitle="Available Staked FIO Balance"
              label="Unstake Amount"
            />

            <p className={classes.transactionTitle}>Transaction cost</p>

            <LowBalanceBadge
              hasLowBalance={notEnoughStaked}
              messageText={`You can unstake only ${walletStakedTokens} FIO`}
            />

            {!selectedAddress ? (
              <LowBalanceBadge
                hasLowBalance={hasLowBalance}
                messageText="You do not have enough Fio in your available balance. Please select an address with available bundles or send more FIO to your wallet."
              />
            ) : (
              <>
                <InfoBadge
                  className={classes.infoBadgeError}
                  type={BADGE_TYPES.ERROR}
                  show={notEnoughBundles}
                  title="No Bundles"
                  message={
                    hasLowBalance ? (
                      <>
                        You do not have enough FIO in your available balance.
                        Please select an address with available bundles or send
                        more FIO to your wallet.
                      </>
                    ) : (
                      <>
                        You do not have any available bundles to use. Please
                        select an address with an available bundle balance, pay
                        the fee below or{' '}
                        <Link
                          to={`${
                            ROUTES.FIO_ADDRESS_ADD_BUNDLES
                          }/${fioAddress as string}`}
                        >
                          add more bundles
                        </Link>
                        .
                      </>
                    )
                  }
                />
              </>
            )}
            {!selectedAddress || notEnoughBundles ? (
              <PriceBadge
                title="Fees"
                type={BADGE_TYPES.BLACK}
                costNativeFio={fee.nativeFio}
                costFio={fee.fio}
                costUsdc={fee.usdc}
              />
            ) : (
              <BundledTransactionBadge
                bundles={BUNDLES_TX_COUNT.UNSTAKE}
                remaining={selectedAddress.remaining}
              />
            )}

            {/*temporary added while fio stake api can't allow accounts without crypto handles*/}
            <InfoBadge
              className={classes.infoBadgeError}
              type={BADGE_TYPES.ERROR}
              show={!fioAddresses.length}
              title="No Crypto Handle"
              message={<>You are not able to unstake without crypto handles.</>}
            />

            <SubmitButton
              text="Unstake FIO Tokens"
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

export default UnstakeTokensForm;
