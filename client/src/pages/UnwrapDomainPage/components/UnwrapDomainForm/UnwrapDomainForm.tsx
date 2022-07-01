import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import classNames from 'classnames';

import TextInput, {
  INPUT_UI_STYLES,
} from '../../../../components/Input/TextInput';
import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import SelectModalInput from '../../../../components/Input/SelectModalInput';
import DangerModal from '../../../../components/Modal/DangerModal';
import FeesModalInput from '../../../../components/ConnectWallet/FeesModal/FeesModalInput';

import { formValidation } from './validation';

import { UnWrapDomainFormProps } from '../../types';

import classes from '../../styles/UnwrapDomainForm.module.scss';

const UnwrapDomainForm: React.FC<UnWrapDomainFormProps> = props => {
  const {
    loading,
    initialValues,
    updateAddressInPage,
    providerData,
    fioAddressesList,
    wrappedDomainsList,
    modalInfoError,
    setModalInfoError,
    onSubmit,
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
        const { wrappedDomainTokenId } = values;
        const wrappedDomainName = wrappedDomainTokenId
          ? wrappedDomainsList.find(o => o.id === wrappedDomainTokenId)?.name
          : null;

        const submitDisabled =
          formRenderProps.hasValidationErrors ||
          (formRenderProps.hasSubmitErrors &&
            !formRenderProps.modifiedSinceLastSubmit) ||
          formRenderProps.submitting ||
          loading ||
          isWrongNetwork;

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
              subTitle="Select or manually enter a FIO Crypto Handle to receive your domain."
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
              name="wrappedDomainTokenId"
              type="text"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={SelectModalInput}
              options={wrappedDomainsList}
              showPasteButton={true}
              placeholder="Enter token id of wFIO domain for unwrapping"
              modalPlaceholder="Enter or select token id of wFIO domain for unwrapping"
              title="Choose wFIO Domain"
              subTitle="Select or manually enter a token id of wFIO domain to unwrap"
              label="wFIO Domain Unwrap"
              footerTitle="Wrapped Domains"
            />
            {wrappedDomainName ? (
              <div className={classes.selectedDomainName}>
                wrapped Domain: <span>{wrappedDomainName}</span>
              </div>
            ) : null}

            <p className={classNames(classes.transactionTitle)}>
              Transaction Fees
            </p>

            <Field
              name="fee"
              component={FeesModalInput}
              title="Fees"
              subTitle="Manually set fees by selecting one of the basics options or for a more advanced option, set your own."
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              valueTitle="MATIC"
              isNFT
            />

            {isWrongNetwork && network?.name ? (
              <div className={classes.warning}>
                Current Network {network.name.toUpperCase()} is not valid for
                unwrap Domain action.
              </div>
            ) : null}

            <SubmitButton
              text="Unwrap FIO Domain"
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
