import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import { formValidation } from './validation';
import { RequestTokensProps } from '../../types';
import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import BundledTransactionBadge from '../../../../components/Badges/BundledTransactionBadge/BundledTransactionBadge';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import { FioAddressDoublet } from '../../../../types';

import { FIO_CHAIN_CODE } from '../../../../constants/fio';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import classes from '../../styles/RequestTokensForm.module.scss';
import LowBalanceBadge from '../../../../components/Badges/LowBalanceBadge/LowBalanceBadge';

const NEW_FUND_REQUEST_BUNDLE_COST = 2;

const RequestTokensForm: React.FC<RequestTokensProps> = props => {
  const { loading, fioWallet, fioAddresses } = props;

  const initialValues: {
    payeeFioAddress?: string;
    payeeTokenPublicAddress: string;
    tokenCode: string;
    chainCode: string;
  } = {
    payeeTokenPublicAddress: fioWallet.publicKey,
    tokenCode: FIO_CHAIN_CODE,
    chainCode: FIO_CHAIN_CODE,
  };
  if (fioAddresses.length) {
    initialValues.payeeFioAddress = fioAddresses[0].name;
  }

  return (
    <Form
      onSubmit={props.onSubmit}
      validate={formValidation.validateForm}
      initialValues={initialValues}
    >
      {(formRenderProps: FormRenderProps) => {
        const {
          values: { payeeFioAddress },
        } = formRenderProps;

        const renderRequester = () => {
          if (!fioAddresses.length) return null;

          return (
            <>
              {fioAddresses.length > 1 ? (
                <Field
                  name="payeeFioAddress"
                  type="dropdown"
                  label="Your Requesting FIO Address"
                  component={Input}
                  placeholder="Select FIO Address"
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
                  component={Input}
                  disabled={true}
                  label="Your Requesting FIO Address"
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
          !formRenderProps.valid ||
          formRenderProps.submitting ||
          loading ||
          notEnoughBundles;

        return (
          <form
            onSubmit={formRenderProps.handleSubmit}
            className={classes.form}
          >
            {renderRequester()}
            <Field
              name="payerFioAddress"
              type="text"
              placeholder="FIO Address or Public Key"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={Input}
              showCopyButton={true}
              disabled={loading}
              label="Request From"
            />

            <Field
              name="amount"
              type="number"
              placeholder="0.00"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={Input}
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
                component={Input}
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
