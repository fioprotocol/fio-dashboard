import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import Dropdown from '../../../../components/Input/Dropdown';
import TextInput, {
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';
import Badge, { BADGE_TYPES } from '../../../../components/Badge/Badge';
import AmountInput from '../../../../components/Input/AmountInput';
import SelectModalInput from '../../../../components/Input/SelectModalInput';
import BundledTransactionBadge from '../../../../components/Badges/BundledTransactionBadge/BundledTransactionBadge';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import LowBalanceBadge from '../../../../components/Badges/LowBalanceBadge/LowBalanceBadge';
import { ChainAndTokenCodesAutocompleteFields } from '../../../../components/ChainAndTokenCodesAutocompleteFields/ChainAndTokenCodesAutocompleteFields';

import PublicKeyField from './PublicKeyField';

import { formValidation, submitValidation } from './validation';
import { minWaitTimeFunction } from '../../../../utils';
import { fioAddressExistsValidator } from '../../../../util/validators';
import FioApi from '../../../../api/fio';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import { ASTERISK_SIGN, CHAIN_CODES } from '../../../../constants/common';
import { BUNDLES_TX_COUNT } from '../../../../constants/fio';

import { RequestTokensProps, RequestTokensValues } from '../../types';
import { FioAddressDoublet } from '../../../../types';

import classes from '../../styles/RequestTokensForm.module.scss';

const CHAIN_CODE_FIELD_NAME = 'chainCode';
const TOKEN_CODE_FIELD_NAME = 'tokenCode';
const CHAIN_CODE_FIELD_LABEL = 'Chain Id';
const TOKEN_CODE_FIELD_LABEL = 'Token';
const INITIAL_CHAIN_CODE_VALUE = CHAIN_CODES.ETH;

const RequestTokensForm: React.FC<RequestTokensProps> = props => {
  const {
    loading,
    fioAddresses,
    pubAddressesMap,
    contactsList,
    initialValues: parentInitialValues,
    isFio,
  } = props;

  const initialValues = { ...parentInitialValues };
  const handleSubmit = async (values: RequestTokensValues) => {
    const validationResult = await submitValidation.validateForm(values);
    if (validationResult) return validationResult;

    const payerFioPublicKey = await new FioApi().getFioPublicAddress(
      values.payerFioAddress,
    );
    return props.onSubmit({
      ...values,
      payerFioPublicKey: payerFioPublicKey?.public_address,
    });
  };

  if (!isFio) {
    initialValues.chainCode = INITIAL_CHAIN_CODE_VALUE;
    initialValues.tokenCode = INITIAL_CHAIN_CODE_VALUE;
  }

  if (fioAddresses.length) {
    if (!initialValues.payeeFioAddress) {
      initialValues.payeeFioAddress = fioAddresses[0].name;
    }
    initialValues.payeeTokenPublicAddress = isFio
      ? fioAddresses[0].walletPublicKey
      : '';

    if (
      !isFio &&
      pubAddressesMap != null &&
      pubAddressesMap[initialValues.payeeFioAddress] != null
    ) {
      const pubAddressItem = pubAddressesMap[
        initialValues.payeeFioAddress
      ].publicAddresses.find(
        ({ chainCode, tokenCode }) =>
          chainCode === initialValues.chainCode &&
          (tokenCode === initialValues.tokenCode ||
            tokenCode === ASTERISK_SIGN),
      );

      if (pubAddressItem != null) {
        initialValues.payeeTokenPublicAddress = pubAddressItem.publicAddress;
      }
    }
  }

  return (
    <Form
      onSubmit={handleSubmit}
      validate={formValidation.validateForm}
      initialValues={initialValues}
    >
      {(formRenderProps: FormRenderProps) => {
        const {
          values: { payeeFioAddress, tokenCode, mapPubAddress },
          validating,
          values,
        } = formRenderProps;

        const onPayeeFioAddressChange = (val: string) => {
          if (!isFio) return;

          const selectedFioAddress: FioAddressDoublet | undefined | null = val
            ? fioAddresses.find(({ name }) => name === val)
            : null;

          if (selectedFioAddress != null)
            formRenderProps.form.change(
              'payeeTokenPublicAddress',
              selectedFioAddress.walletPublicKey,
            );
        };
        const transactionCost = mapPubAddress
          ? BUNDLES_TX_COUNT.NEW_FIO_REQUEST +
            BUNDLES_TX_COUNT.ADD_PUBLIC_ADDRESS
          : BUNDLES_TX_COUNT.NEW_FIO_REQUEST;

        const renderRequester = () => {
          if (!fioAddresses.length) return null;

          return (
            <>
              {fioAddresses.length > 1 ? (
                <Field
                  name="payeeFioAddress"
                  label="Your Requesting FIO Handle"
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
                  name="payeeFioAddress"
                  type="text"
                  uiType={INPUT_UI_STYLES.BLACK_WHITE}
                  errorColor={COLOR_TYPE.WARN}
                  component={TextInput}
                  disabled={true}
                  label="Your Requesting FIO Handle"
                />
              )}
            </>
          );
        };

        const selectedAddress:
          | FioAddressDoublet
          | undefined
          | null = payeeFioAddress
          ? fioAddresses.find(({ name }) => name === payeeFioAddress)
          : null;

        const notEnoughBundles =
          selectedAddress != null
            ? selectedAddress.remaining < transactionCost
            : false;

        const noPayeeFioAddress =
          fioAddresses != null && fioAddresses.length < 1 && !loading;

        const submitDisabled =
          formRenderProps.hasValidationErrors ||
          (formRenderProps.hasSubmitErrors &&
            !formRenderProps.modifiedSinceLastSubmit) ||
          formRenderProps.submitting ||
          loading ||
          notEnoughBundles ||
          noPayeeFioAddress;

        return (
          <form
            onSubmit={formRenderProps.handleSubmit}
            className={classes.form}
          >
            <OnChange name="payeeFioAddress">
              {onPayeeFioAddressChange}
            </OnChange>
            {renderRequester()}

            <div className={classes.chainAndTokenCodesContainer}>
              <ChainAndTokenCodesAutocompleteFields
                chainCodeFieldLabel={CHAIN_CODE_FIELD_LABEL}
                chainCodeFieldName={CHAIN_CODE_FIELD_NAME}
                chainCodeInitialValue={INITIAL_CHAIN_CODE_VALUE}
                hasAutoWidth={true}
                hasFullWidth={true}
                hideComponent={isFio}
                hideError={true}
                isHigh={true}
                noShadow={true}
                tokenCodeFieldLabel={TOKEN_CODE_FIELD_LABEL}
                tokenCodeFieldName={TOKEN_CODE_FIELD_NAME}
                uiType={INPUT_UI_STYLES.BLACK_WHITE}
              />
            </div>

            {!isFio && (
              <PublicKeyField
                loading={loading}
                pubAddressesMap={pubAddressesMap}
              />
            )}

            <Field
              name="payerFioAddress"
              placeholder="Enter or select FIO request Address"
              modalPlaceholder="Enter or select FIO Handle"
              title="Choose FIO Handle"
              subTitle="Enter or select a FIO Handle to request tokens from"
              notFoundText="No FIO Handles found"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={SelectModalInput}
              options={contactsList}
              showPasteButton={true}
              lowerCased={true}
              disabled={loading}
              loading={validating}
              label="Request From"
              handleConfirmValidate={(value: string) =>
                minWaitTimeFunction(
                  () =>
                    fioAddressExistsValidator({
                      value,
                      values,
                      customArgs: {
                        fieldIdToCompare: 'payeeTokenPublicAddress',
                        sameWalletMessage: "Can't request to same wallet",
                      },
                    }),
                  500,
                )
              }
            />

            {isFio ? (
              <Field
                name="amount"
                type="number"
                placeholder="0.00"
                uiType={INPUT_UI_STYLES.BLACK_WHITE}
                errorColor={COLOR_TYPE.WARN}
                component={AmountInput}
                disabled={loading}
                label="Request Amount"
              />
            ) : (
              <Field
                name="amount"
                type="number"
                placeholder="0.00"
                uiType={INPUT_UI_STYLES.BLACK_WHITE}
                errorColor={COLOR_TYPE.WARN}
                component={TextInput}
                prefixLabel={tokenCode}
                disabled={loading}
                label="Request Amount"
                step="any"
              />
            )}

            <Field
              name="memo"
              type="text"
              placeholder="Enter your message"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={TextInput}
              disabled={loading}
              label="Memo"
            />

            {selectedAddress != null ? (
              <>
                <p className={classes.transactionTitle}>Transaction cost</p>
                <BundledTransactionBadge
                  bundles={transactionCost}
                  remaining={selectedAddress.remaining}
                />
              </>
            ) : null}

            <LowBalanceBadge
              hasLowBalance={notEnoughBundles}
              messageText="Not enough bundles"
            />
            <Badge show={noPayeeFioAddress} type={BADGE_TYPES.ERROR}>
              You should have a FIO Handle in order to be able to sent request
            </Badge>

            <SubmitButton
              text="Send FIO Request"
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

export default RequestTokensForm;
