import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';

import classNames from 'classnames';

import SubmitButton from '../../../../components/common/SubmitButton/SubmitButton';
import SelectModalInput from '../../../../components/Input/SelectModalInput';
import DangerModal from '../../../../components/Modal/DangerModal';
import AmountInput from '../../../../components/Input/AmountInput';
import FeesModalInput from '../../../../components/ConnectWallet/FeesModal/FeesModalInput';
import InfoBadge from '../../../../components/InfoBadge/InfoBadge';
import TextInput from '../../../../components/Input/TextInput';

import MathOp from '../../../../util/math';
import { formValidation } from './validation';
import { switchEthereumChain } from '../../../../util/ethereum';

import { COLOR_TYPE } from '../../../../components/Input/ErrorBadge';
import { INPUT_UI_STYLES } from '../../../../components/Input/TextInput';
import { BADGE_TYPES } from '../../../../components/Badge/Badge';
import { CURRENCY_CODES } from '../../../../constants/common';
import { NETWORKS_LIST } from '../../../../constants/ethereum';
import { WRAP_TYPE } from '../../../../constants/wrap';
import { log } from '../../../../util/general';

import { WrapTokensFormProps } from '../../types';

import classes from '../../styles/UnwrapTokensForm.module.scss';
import Dropdown from '../../../../components/Input/Dropdown';

const networkOptions: { id: string; name: string; chainId: number }[] = [
  NETWORKS_LIST.Ethereum,
  NETWORKS_LIST.Base,
].map(network => ({
  name: network.name,
  id: network.chainCode,
  chainId: network.chainID,
}));

const UnwrapTokensForm: React.FC<WrapTokensFormProps> = props => {
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
      initialValues={{
        ...initialValues,
        chainCode: networkOptions[0]?.id,
      }}
    >
      {(formRenderProps: FormRenderProps) => {
        const { validating, values } = formRenderProps;
        const selectedNetwork = Object.values(NETWORKS_LIST).find(
          networkItem => networkItem.chainCode === values.chainCode,
        );

        const handleChainChange = async (chainCode: string) => {
          const selectedNetwork = Object.values(NETWORKS_LIST).find(
            networkItem => networkItem.chainCode === chainCode,
          );

          if (!selectedNetwork) {
            log.error(`Unsupported chain code: ${chainCode}`);
            return;
          }

          try {
            await switchEthereumChain({
              provider: providerData?.provider,
              targetChainId: selectedNetwork.chainID,
              currentChainId: providerData?.network?.chainId,
            });
          } catch (e) {
            log.error('Error switching network', e);
          }
        };

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
              name="chainCode"
              component={Dropdown}
              options={networkOptions}
              defaultOptionValue={networkOptions[0]}
              placeholder="Select Network"
              label="Target Network"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              isWhite
              isHigh
              isSimple
              hideError
              additionalOnchangeAction={handleChainChange}
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
              connectWalletTargetChainId={selectedNetwork?.chainID}
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
              message={`The connected network ${network?.name.toUpperCase()}, is not valid for unwrapping tokens.`}
            />

            <Field
              name="fioAddress"
              placeholder="Enter or select FIO Handle"
              modalPlaceholder="Enter FIO Handle"
              title="Choose FIO Handle"
              subTitle="Select or manually enter a FIO Handle to receive your tokens."
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
              name="amount"
              type="number"
              label="wFIO Unwrap Amount"
              placeholder="Enter Unwrap Amount"
              amountCurrencyCode={CURRENCY_CODES.wFIO}
              availableTitle="Available wFIO Balance"
              uiType={INPUT_UI_STYLES.BLACK_WHITE}
              errorColor={COLOR_TYPE.WARN}
              availableValue={wFioBalance}
              isUnwrap={true}
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
              valueTitle={values.chainCode}
              errorColor={COLOR_TYPE.WARN}
              chainCode={values.chainCode}
              wrapType={WRAP_TYPE.TOKEN}
            />

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

export default UnwrapTokensForm;
