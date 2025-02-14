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
import InfoBadge from '../../../../components/InfoBadge/InfoBadge';

import { formValidation } from './validation';

import { BADGE_TYPES } from '../../../../components/Badge/Badge';
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
        const wrappedDomainName =
          wrappedDomainTokenId && wrappedDomainsList?.length
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

            <InfoBadge
              className={classes.infoBadge}
              type={BADGE_TYPES.ERROR}
              show={isWrongNetwork && !!network?.name}
              title="Network!"
              message={`The connected network ${network?.name.toUpperCase()}, is not valid for unwrapping domains.`}
            />

            <Field
              name="fioAddress"
              placeholder="Enter or select FIO Handle"
              modalPlaceholder="Enter FIO Handle"
              title="Choose FIO Handle"
              subTitle="Select or manually enter a FIO Handle to receive your domain."
              footerTitle="Available FIO Handles"
              notFoundText="No FIO Handles found"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={SelectModalInput}
              options={fioAddressesList}
              showPasteButton={true}
              lowerCased={true}
              disabled={loading}
              loading={validating}
              label="FIO Handle"
            />

            <Field
              name="wrappedDomainTokenId"
              type="text"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              component={SelectModalInput}
              options={wrappedDomainsList || []}
              showPasteButton={true}
              placeholder="Enter token id of FIO domain for unwrapping"
              modalPlaceholder="Enter or select token id of FIO domain for unwrapping"
              title="Choose FIO Domain"
              subTitle="Select or manually enter a token id of FIO domain to unwrap"
              label="FIO Domain Unwrap"
              footerTitle={
                <>
                  <span>Wrapped Domains</span>
                  <InfoBadge
                    className={classes.unwrapInfoBadge}
                    type={BADGE_TYPES.INFO}
                    show={true}
                    title="Wrapped Domains"
                    message="It may take up to 15 minutes for newly wrapped domains to display and be available for further action."
                  />
                </>
              }
              notFoundText="No FIO Domains found"
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
              valueTitle="POL"
              isNFT
            />

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
