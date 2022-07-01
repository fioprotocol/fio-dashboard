import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import classNames from 'classnames';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import SelectModalInput from '../../../../components/Input/SelectModalInput';
import DangerModal from '../../../../components/Modal/DangerModal';
import AmountInput from '../../../../components/Input/AmountInput';
import FeesModalInput from '../../../../components/ConnectWallet/FeesModal/FeesModalInput';

import MathOp from '../../../../util/math';
import { formValidation } from './validation';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import TextInput, {
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';
import { WrapTokensFormProps } from '../../types';

import classes from '../../styles/UnwrapTokensForm.module.scss';

const UnwrapDomainForm: React.FC<WrapTokensFormProps> = props => {
  const {
    loading,
    initialValues,
    onSubmit,
    wFioBalance,
    modalInfoError,
    setModalInfoError,
    updateAddressInPage,
    providerData,
    fioAddressesList,
    isWrongNetwork,
    network,
  } = props;

  return (
    <Form
      onSubmit={onSubmit}
      validate={formValidation.validateForm}
      initialValues={initialValues}
    >
      {(formRenderProps: FormRenderProps) => {
        const { validating, values } = formRenderProps;

        const submitDisabled =
          formRenderProps.hasValidationErrors ||
          (formRenderProps.hasSubmitErrors &&
            !formRenderProps.modifiedSinceLastSubmit) ||
          formRenderProps.submitting ||
          loading ||
          isWrongNetwork ||
          (wFioBalance && new MathOp(values.amount || 0).gt(wFioBalance));

        return (
          <form
            onSubmit={formRenderProps.handleSubmit}
            className={classes.form}
          >
            <DangerModal
              show={!!modalInfoError}
              title={modalInfoError}
              onClose={() => setModalInfoError(null)}
              buttonText="Close"
              onActionButtonClick={() => setModalInfoError(null)}
            />
            <Field
              name="publicAddress"
              type="text"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={TextInput}
              additionalOnchangeAction={updateAddressInPage}
              showConnectWalletButton
              connectWalletProps={providerData}
              connectWalletModalText="Please connect your Ethereum wallet where you have wFio which you would like to unwrap (exchange) for FIO."
              showPasteButton={false}
              disabled={true}
              placeholder="Connect a Wallet"
              label="Public Address"
            />

            <Field
              name="fioAddress"
              placeholder="Enter or select FIO Crypto Handle"
              modalPlaceholder="Enter FIO Crypto Handle"
              title="Choose FIO Crypto Handle"
              subTitle="Select or manually enter a FIO Crypto Handle to receive your tokens."
              footerTitle="Available FIO Crypto Handles"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={SelectModalInput}
              options={fioAddressesList}
              showPasteButton={true}
              lowerCased={true}
              disabled={loading}
              loading={validating}
              label="FIO Crypto Handle"
            />

            <Field
              name="amount"
              type="number"
              label="wFIO Unwrap Amount"
              placeholder="Enter Unwrap Amount"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              availableValue={wFioBalance}
              component={AmountInput}
            />

            <p className={classNames(classes.transactionTitle)}>
              Transaction Fees
            </p>

            <Field
              name="fee"
              component={FeesModalInput}
              title="Fees"
              subTitle="Manually set fees by selecting one of the basics options or for a more advanced option, set your own."
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              valueTitle="ETH"
              errorColor={COLOR_TYPE.WARN}
            />

            {isWrongNetwork && network?.name ? (
              <div className={classes.warning}>
                Current Network {network.name.toUpperCase()} is not valid for
                unwrap Tokens action.
              </div>
            ) : null}

            <SubmitButton
              text="Unwrap FIO Tokens"
              disabled={submitDisabled}
              loading={loading || formRenderProps.submitting}
              withTopMargin={true}
            />
          </form>
        );
      }}
    </Form>
  );
};

export default UnwrapDomainForm;
