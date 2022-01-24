import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import { formValidation, submitValidation } from './validation';
import { RequestTokensProps, RequestTokensValues } from '../../types';
import Dropdown from '../../../../components/Input/Dropdown';
import TextInput, {
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';
import AmountInput from '../../../../components/Input/AmountInput';
import SelectModalInput from '../../../../components/Input/SelectModalInput';
import BundledTransactionBadge from '../../../../components/Badges/BundledTransactionBadge/BundledTransactionBadge';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import { FioAddressDoublet } from '../../../../types';

import { FIO_CHAIN_CODE } from '../../../../constants/fio';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import classes from '../../styles/RequestTokensForm.module.scss';
import LowBalanceBadge from '../../../../components/Badges/LowBalanceBadge/LowBalanceBadge';

const STATIC_TOKENS_LIST = [{ id: 'FIO', name: 'FIO' }];
const STATIC_CHAIN_IDS_LIST = [{ id: FIO_CHAIN_CODE, name: FIO_CHAIN_CODE }];
const NEW_FUND_REQUEST_BUNDLE_COST = 2;

const RequestTokensForm: React.FC<RequestTokensProps> = props => {
  const { loading, fioWallet, fioAddresses, roe, contactsList, isFio } = props;

  const handleSubmit = async (values: RequestTokensValues) => {
    const validationResult = await submitValidation.validateForm(values);
    if (validationResult) return validationResult;

    return props.onSubmit(values);
  };

  const initialValues: {
    payeeFioAddress?: string;
    payeeTokenPublicAddress: string;
    tokenCode: string;
    chainCode: string;
  } = {
    payeeTokenPublicAddress: fioWallet.publicKey,
    tokenCode: STATIC_TOKENS_LIST[0].name,
    chainCode: STATIC_CHAIN_IDS_LIST[0].name,
  };
  if (fioAddresses.length) {
    initialValues.payeeFioAddress = fioAddresses[0].name;
  }

  return (
    <Form
      onSubmit={handleSubmit}
      validate={formValidation.validateForm}
      initialValues={initialValues}
    >
      {(formRenderProps: FormRenderProps) => {
        const {
          values: { payeeFioAddress },
          validating,
        } = formRenderProps;

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

        const selectedAddress: FioAddressDoublet | null = payeeFioAddress
          ? fioAddresses.find(({ name }) => name === payeeFioAddress)
          : null;

        const notEnoughBundles =
          selectedAddress != null
            ? selectedAddress.remaining < NEW_FUND_REQUEST_BUNDLE_COST
            : false;

        const submitDisabled =
          formRenderProps.hasValidationErrors ||
          (formRenderProps.hasSubmitErrors &&
            !formRenderProps.modifiedSinceLastSubmit) ||
          formRenderProps.submitting ||
          loading ||
          notEnoughBundles;

        return (
          <form
            onSubmit={formRenderProps.handleSubmit}
            className={classes.form}
          >
            {renderRequester()}

            {!isFio && (
              <div className="d-flex justify-content-between align-items-center w-100 flex-grow-1">
                <div className="w-100 mr-2">
                  <Field
                    name="tokenCode"
                    label="Token"
                    component={Dropdown}
                    placeholder="Select Token type"
                    options={STATIC_TOKENS_LIST}
                    uiType={INPUT_UI_STYLES.BLACK_WHITE}
                    isSimple={true}
                    isWidthResponsive={true}
                    isHigh={true}
                    isWhite={true}
                  />
                </div>
                <div className="w-100 ml-2">
                  <Field
                    name="chainCode"
                    label="Chain Id"
                    component={Dropdown}
                    placeholder="Select Chain Id"
                    options={STATIC_CHAIN_IDS_LIST}
                    uiType={INPUT_UI_STYLES.BLACK_WHITE}
                    isSimple={true}
                    isWidthResponsive={true}
                    isHigh={true}
                    isWhite={true}
                  />
                </div>
              </div>
            )}

            <Field
              name="payerFioAddress"
              placeholder="Enter or select FIO request Address"
              modalPlaceholder="Enter or select FIO Crypto Handle or Public Key"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={SelectModalInput}
              options={contactsList}
              showCopyButton={true}
              disabled={loading}
              loading={validating}
              label="Request From"
            />

            <Field
              name="amount"
              type="number"
              placeholder="0.00"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={AmountInput}
              roe={roe}
              disabled={loading}
              label="Request Amount"
            />

            {selectedAddress != null ? (
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
            ) : null}

            <p className={classes.transactionTitle}>Transaction cost</p>
            {selectedAddress != null ? (
              <BundledTransactionBadge
                bundles={NEW_FUND_REQUEST_BUNDLE_COST}
                remaining={selectedAddress.remaining}
              />
            ) : null}

            <LowBalanceBadge
              hasLowBalance={notEnoughBundles}
              messageText="Not enough bundles"
            />

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
