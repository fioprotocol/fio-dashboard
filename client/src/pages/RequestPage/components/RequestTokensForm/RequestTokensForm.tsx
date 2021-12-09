import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import { validate } from './validation';
import { FIORequestFormProps } from '../../types';
import Input, { INPUT_UI_STYLES } from '../../../../components/Input/Input';
import BundledTransactionBadge from '../../../../components/Badges/BundledTransactionBadge/BundledTransactionBadge';
import LowBalanceBadge from '../../../../components/Badges/LowBalanceBadge/LowBalanceBadge';
import PriceBadge from '../../../../components/Badges/PriceBadge/PriceBadge';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';

import { FeePrice, FioAddressDoublet } from '../../../../types';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import { BADGE_TYPES } from '../../../../components/Badge/Badge';

import classes from '../../styles/RequestTokensForm.module.scss';

// todo: get from api
const RECORD_OBT_DATA_BUNDLE_COST = 2;

const RequestTokensForm: React.FC<FIORequestFormProps> = props => {
  const { onSubmit, fioAddresses, fee, loading, fioWallet } = props;

  const initialValues: {
    fioAddressRequestFrom?: string;
    fromPubKey: string;
    fee: FeePrice;
  } = {
    fromPubKey: (fioWallet && fioWallet.publicKey) || '',
    fioAddressRequestFrom: (fioWallet && fioWallet.publicKey) || '',
    fee: fee || {
      nativeFio: 0,
      costFio: 0,
      costUsdc: 0,
    },
  };
  if (fioAddresses.length) {
    initialValues.fioAddressRequestFrom = fioAddresses[0].name;
  }

  return (
    <Form onSubmit={onSubmit} validate={validate} initialValues={initialValues}>
      {/* tslint:disable-next-line:no-shadowed-variable */}
      {(props: FormRenderProps) => {
        const {
          values: { from, amount },
        } = props;

        const renderSender = () => {
          // if (!obtDataOn) return null;
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
              label="Amount"
            />

            {selectedAddress != null ? (
              <Field
                name="memo"
                type="text"
                placeholder="Set your memo"
                uiType={INPUT_UI_STYLES.BLACK_WHITE}
                errorColor={COLOR_TYPE.WARN}
                component={Input}
                disabled={false}
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
            {selectedAddress != null ? (
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
              text="Send FIO Request"
              disabled={submitDisabled}
              loading={false}
              withTopMargin={true}
            />
          </form>
        );
      }}
    </Form>
  );
};

export default RequestTokensForm;
