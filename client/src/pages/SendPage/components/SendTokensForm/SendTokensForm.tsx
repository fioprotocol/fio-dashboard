import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { validate } from './validation';
import { SendTokensProps } from '../../types';
import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import BundledTransactionBadge from '../../../../components/Badges/BundledTransactionBadge/BundledTransactionBadge';
import LowBalanceBadge from '../../../../components/Badges/LowBalanceBadge/LowBalanceBadge';
import PriceBadge from '../../../../components/Badges/PriceBadge/PriceBadge';

import { FioAddressDoublet } from '../../../../types';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import { BADGE_TYPES } from '../../../../components/Badge/Badge';

import classes from '../../styles/SendTokensForm.module.scss';

// todo: get from api
const RECORD_OBT_DATA_BUNDLE_COST = 2;

const SendTokensForm: React.FC<SendTokensProps> = props => {
  const { loading, fioWallet, fioAddresses, fee, obtDataOn } = props;

  const initialValues: { from?: string } = {};
  if (fioAddresses.length) {
    initialValues.from = fioAddresses[0].name;
  }

  return (
    <Form
      onSubmit={props.onSubmit}
      validate={validate}
      initialValues={initialValues}
    >
      {(props: FormRenderProps) => {
        const {
          values: { from, amount },
        } = props;

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
                  isBigHeight={true}
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

        const hasLowBalance = fee.costFio + amount > fioWallet.available;
        const notEnoughBundles =
          selectedAddress != null
            ? selectedAddress.remaining < RECORD_OBT_DATA_BUNDLE_COST
            : false;
        const submitDisabled =
          !props.valid ||
          props.submitting ||
          loading ||
          hasLowBalance ||
          notEnoughBundles ||
          !fee.nativeFio;

        return (
          <form onSubmit={props.handleSubmit} className={classes.form}>
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

            {selectedAddress != null && obtDataOn ? (
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

            <Field
              name="fromPubKey"
              defaultValue={fioWallet.publicKey}
              type="hidden"
              component={Input}
            />

            <p className={classes.transactionTitle}>Transaction cost</p>
            <PriceBadge
              title="Transaction Fee"
              type={BADGE_TYPES.BLACK}
              costFio={fee.costFio}
              costUsdc={fee.costUsdc}
            />
            {selectedAddress != null && obtDataOn ? (
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

            <Button
              type="submit"
              disabled={submitDisabled}
              className={classes.button}
            >
              {loading ? (
                <FontAwesomeIcon icon="spinner" spin />
              ) : (
                'Send FIO Tokens'
              )}
            </Button>
          </form>
        );
      }}
    </Form>
  );
};

export default SendTokensForm;
