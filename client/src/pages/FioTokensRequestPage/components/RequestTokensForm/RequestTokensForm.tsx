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
import TokenDataFields from './TokenDataFields';
import PublicKeyField from './PublicKeyField';
import LowBalanceBadge from '../../../../components/Badges/LowBalanceBadge/LowBalanceBadge';

import { formValidation, submitValidation } from './validation';
import { minWaitTimeFunction } from '../../../../utils';
import { fioAddressExistsValidator } from '../../../../util/validators';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import { CHAIN_CODE_LIST } from '../../../../constants/common';
import { BUNDLES_TX_COUNT } from '../../../../constants/fio';

import { RequestTokensProps, RequestTokensValues } from '../../types';
import { FioAddressDoublet } from '../../../../types';

import classes from '../../styles/RequestTokensForm.module.scss';

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

    return props.onSubmit(values);
  };

  if (!isFio) {
    initialValues.chainCode = CHAIN_CODE_LIST[0].id;
    initialValues.tokenCode = CHAIN_CODE_LIST[0].tokens?.length
      ? CHAIN_CODE_LIST[0].tokens[0].id
      : CHAIN_CODE_LIST[0].id;
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
          tokenCode === initialValues.tokenCode,
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
          values: { payeeFioAddress, chainCode, tokenCode, mapPubAddress },
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
                  label="Your Requesting FIO Crypto Handle"
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
                  name="payeeFioAddress"
                  type="text"
                  uiType={INPUT_UI_STYLES.BLACK_WHITE}
                  errorColor={COLOR_TYPE.WARN}
                  component={TextInput}
                  disabled={true}
                  label="Your Requesting FIO Crypto Handle"
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

            <TokenDataFields
              isVisible={!isFio}
              chainCodeValue={chainCode}
              chainCodeList={CHAIN_CODE_LIST}
              initialValues={initialValues}
            />

            {!isFio && (
              <PublicKeyField
                loading={loading}
                pubAddressesMap={pubAddressesMap}
              />
            )}

            <Field
              name="payerFioAddress"
              placeholder="Enter or select FIO request Address"
              modalPlaceholder="Enter or select FIO Crypto Handle"
              title="Choose FIO Crypto Handle"
              subTitle="Enter or select a FIO Crypto Handle to request tokens from"
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
              You should have a FIO Crypto Handle in order to be able to sent
              request
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
