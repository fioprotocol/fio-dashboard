import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import classnames from 'classnames';

import TextInput, {
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';
import BundledTransactionBadge from '../../../../components/Badges/BundledTransactionBadge/BundledTransactionBadge';
import LowBalanceBadge from '../../../../components/Badges/LowBalanceBadge/LowBalanceBadge';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';

import { formValidation } from './validation';

import { BUNDLES_TX_COUNT } from '../../../../constants/fio';

import { PaymentDetailsProps, PaymentDetailsValues } from '../../types';

import classes from '../../styles/PaymentDetailsForm.module.scss';
import QrCodeInput from '../../../../components/Input/QrCodeInput';
import QrModal from './QrModal';
import { isFioChain } from '../../../../util/fio';

const PaymentDetailsForm: React.FC<PaymentDetailsProps> = props => {
  const { loading, senderFioAddress, initialValues } = props;

  const handleSubmit = async (values: PaymentDetailsValues) => {
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
          values: { chainCode, tokenCode },
        } = formRenderProps;

        const notEnoughBundles =
          senderFioAddress != null
            ? senderFioAddress.remaining < BUNDLES_TX_COUNT.RECORD_OBT_DATA
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
            <Field
              name="payeeFioAddress"
              type="text"
              prefixLabel="To"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={TextInput}
              disabled={true}
              label="Request Information"
            />

            <div className={classes.additionalInfo}>
              {!isFioChain(chainCode) && (
                <>
                  <div
                    className={classnames(classes.paragraph, classes.cursive)}
                  >
                    To complete this transaction please send your payment to
                    this public address. Once completed, enter the Payment
                    Transaction Id and Memo to complete this request.
                  </div>
                  <div
                    className={classnames(
                      classes.paragraph,
                      classes.dark,
                      classes.cursive,
                      classes.bold,
                    )}
                  >
                    Make sure you send tokens on the correct chain to avoid loss
                    of funds.
                  </div>
                </>
              )}
              <div className={classnames(classes.paragraph, classes.dark)}>
                {`Public Address Chain ID: ${(chainCode as string) || ''}`}
              </div>
            </div>

            <Field
              name="payeePublicAddress"
              type="text"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              renderModalComponent={QrModal}
              component={QrCodeInput}
            />
            <Field
              name="amount"
              type="number"
              prefixLabel={tokenCode}
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={TextInput}
              disabled={loading}
              label="Send Amount"
              step="any"
            />
            <Field
              name="obtId"
              type="text"
              placeholder="Enter Transaction Id"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={TextInput}
              disabled={loading}
              label="Transaction Id"
            />
            <Field
              name="memo"
              type="text"
              placeholder="Enter memo"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={TextInput}
              disabled={loading}
              label="Memo"
            />
            <p className={classes.transactionTitle}>Transaction information</p>
            {senderFioAddress ? (
              <BundledTransactionBadge
                bundles={BUNDLES_TX_COUNT.RECORD_OBT_DATA}
                remaining={senderFioAddress.remaining}
              />
            ) : null}
            <LowBalanceBadge
              hasLowBalance={notEnoughBundles}
              messageText="Not enough bundles"
            />
            <SubmitButton
              text="Send Payment Details"
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

export default PaymentDetailsForm;
