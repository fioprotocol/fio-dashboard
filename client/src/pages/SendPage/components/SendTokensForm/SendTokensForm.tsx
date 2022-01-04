import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import BundledTransactionBadge from '../../../../components/Badges/BundledTransactionBadge/BundledTransactionBadge';
import LowBalanceBadge from '../../../../components/Badges/LowBalanceBadge/LowBalanceBadge';
import PriceBadge from '../../../../components/Badges/PriceBadge/PriceBadge';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import { BADGE_TYPES } from '../../../../components/Badge/Badge';

import { validate } from './validation';
import { hasFioAddressDelimiter } from '../../../../utils';

import { SendTokensProps } from '../../types';
import { FioAddressDoublet } from '../../../../types';

import classes from '../../styles/SendTokensForm.module.scss';

// todo: get from api
const RECORD_OBT_DATA_BUNDLE_COST = 2;

const SendTokensForm: React.FC<SendTokensProps> = props => {
  const { loading, fioWallet, fioAddresses, fee, obtDataOn } = props;

  const initialValues: { from?: string; fromPubKey: string } = {
    fromPubKey: fioWallet.publicKey,
  };
  if (fioAddresses.length) {
    initialValues.from = fioAddresses[0].name;
  }

  return (
    <Form
      onSubmit={props.onSubmit}
      validate={validate}
      initialValues={initialValues}
    >
      {(formRenderProps: FormRenderProps) => {
        const {
          values: { from, to, amount, memo },
        } = formRenderProps;

        const renderSender = () => {
          if (!obtDataOn) return null;
          if (!fioAddresses.length) return null;

          return (
            <>
              {fioAddresses.length > 1 ? (
                <Field
                  name="from"
                  type="dropdown"
                  label="Your Sending FIO Address"
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
                  name="from"
                  type="text"
                  uiType={INPUT_UI_STYLES.BLACK_WHITE}
                  errorColor={COLOR_TYPE.WARN}
                  component={Input}
                  disabled={true}
                  label="Your Sending FIO Address"
                />
              )}
            </>
          );
        };

        const selectedAddress: FioAddressDoublet | null = from
          ? fioAddresses.find(({ name }) => name === from)
          : null;

        const showMemo =
          selectedAddress != null &&
          obtDataOn &&
          to &&
          hasFioAddressDelimiter(to);
        const hasLowBalance = fee.costFio + amount > fioWallet.available;
        const notEnoughBundles =
          selectedAddress != null
            ? selectedAddress.remaining < RECORD_OBT_DATA_BUNDLE_COST
            : false;
        const submitDisabled =
          !formRenderProps.valid ||
          formRenderProps.submitting ||
          loading ||
          hasLowBalance ||
          notEnoughBundles ||
          !fee.nativeFio;

        return (
          <form
            onSubmit={formRenderProps.handleSubmit}
            className={classes.form}
          >
            {renderSender()}
            <Field
              name="to"
              type="text"
              placeholder="FIO Address or Public Key"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={Input}
              showCopyButton={true}
              disabled={loading}
              label="Send to Address"
            />

            <Field
              name="amount"
              type="number"
              placeholder="0.00"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={Input}
              disabled={loading}
              label="Send Amount"
            />

            {showMemo ? (
              <Field
                name="memo"
                type="text"
                placeholder="Set your memo"
                uiType={INPUT_UI_STYLES.BLACK_WHITE}
                errorColor={COLOR_TYPE.WARN}
                component={Input}
                disabled={loading}
                label="Memo"
              />
            ) : null}

            <Field name="fromPubKey" type="hidden" component={Input} />

            <p className={classes.transactionTitle}>Transaction cost</p>
            <PriceBadge
              title="Transaction Fee"
              type={BADGE_TYPES.BLACK}
              costFio={fee.costFio}
              costUsdc={fee.costUsdc}
            />
            {showMemo && memo ? (
              <BundledTransactionBadge
                bundles={RECORD_OBT_DATA_BUNDLE_COST}
                remaining={selectedAddress.remaining}
              />
            ) : null}
            <LowBalanceBadge
              hasLowBalance={hasLowBalance}
              messageText="Not enough Fio"
            />
            <LowBalanceBadge
              hasLowBalance={notEnoughBundles}
              messageText="Not enough bundles"
            />

            <SubmitButton
              text="Send FIO Tokens"
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

export default SendTokensForm;
