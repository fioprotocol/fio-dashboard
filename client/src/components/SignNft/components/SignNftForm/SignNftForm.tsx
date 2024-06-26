import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { Col, Container, Row } from 'react-bootstrap';

import { TransactionDetails } from '../../../TransactionDetails/TransactionDetails';
import InfoBadge from '../../../InfoBadge/InfoBadge';
import CustomDropdown from '../CustomDropdown';
import Input, { INPUT_UI_STYLES } from '../../../Input/Input';
import LowBalanceBadge from '../../../Badges/LowBalanceBadge/LowBalanceBadge';
import FioName from '../../../common/FioName/FioName';
import SubmitButton from '../../../common/SubmitButton/SubmitButton';

import { BADGE_TYPES } from '../../../Badge/Badge';
import { COLOR_TYPE } from '../../../Input/ErrorBadge';

import ChainCodeField from '../../../ChainCodeField/ChainCodeField';

import { formValidation } from './validation';

import { NFT_CHAIN_CODE_LIST } from '../../../../constants/common';

import { SignNftFormProps } from '../../types';

import classes from '../../SignNft.module.scss';

const SignNFTForm: React.FC<SignNftFormProps> = props => {
  const {
    onSubmit,
    initialValues,
    fieldValuesChanged,
    alreadySigned,
    selectedFioAddressName,
    fioAddresses,
    onFioHandleChange,
    bundleCost,
    hasLowBalance,
    processing,
    fioAddress,
    isEdit,
    addressSelectOff,
    currentWallet,
    loading,
  } = props;

  const hasFioCryptoHandleError = (!fioAddress || !currentWallet) && !loading;

  return (
    <Form
      onSubmit={onSubmit}
      validate={formValidation.validateForm}
      initialValues={initialValues}
    >
      {(formRenderProps: FormRenderProps) => {
        const { blur } = formRenderProps?.form || {};

        const onBlur = (fieldName: string) => {
          blur && blur(fieldName);
        };
        return (
          <form onSubmit={formRenderProps.handleSubmit}>
            <OnChange name="chainCode">{fieldValuesChanged}</OnChange>
            <OnChange name="contractAddress">{fieldValuesChanged}</OnChange>
            <OnChange name="tokenId">{fieldValuesChanged}</OnChange>
            <Container fluid className={classes.signSection}>
              {!isEdit && !addressSelectOff ? (
                <>
                  <InfoBadge
                    type={BADGE_TYPES.INFO}
                    show={alreadySigned}
                    title="Already Signed"
                    message="This NFT that you are attempting to sign, has already been signed"
                  />
                  <InfoBadge
                    type={BADGE_TYPES.WARNING}
                    show={hasFioCryptoHandleError}
                    title="FIO Handle Error"
                    message={
                      <>
                        <div>One of the issues could cause the error:</div>
                        <div>- FIO Handle or wallet public key is missing.</div>
                        <div>
                          - FIO Handle and wallet public key missmatch. Please
                          choose another FIO Handle.
                        </div>
                      </>
                    }
                  />
                  <Row className="mt-4">
                    <Col className={classes.subTitleSection}>Details</Col>
                  </Row>
                  <Row>
                    <Col className={classes.subTitleSection}>
                      <div
                        className={`${classes.fioAddress} d-flex justify-content-start`}
                      >
                        <div className={classes.fioAddressLabel}>
                          FIO Handle
                        </div>
                        <CustomDropdown
                          value={selectedFioAddressName}
                          list={fioAddresses.map(({ name }) => name)}
                          onChange={onFioHandleChange}
                        />
                      </div>
                    </Col>
                  </Row>
                </>
              ) : (
                <div className="mt-3 mb-3">
                  <FioName name={fioAddress?.name} />
                  <Row>
                    <Col className={classes.subTitleSection}>
                      Signed NFT Details
                    </Col>
                  </Row>
                </div>
              )}
              <div className={classes.chainContainer}>
                <Col>
                  <ChainCodeField
                    hasAutoWidth={true}
                    noShadow={true}
                    isHigh={true}
                    errorColor={COLOR_TYPE.WARN}
                    disabled={isEdit}
                    prefixLabel="Chain Code"
                    optionsList={NFT_CHAIN_CODE_LIST}
                    upperCased={true}
                    onBlur={onBlur}
                  />
                </Col>
                <Col>
                  <Field
                    name="tokenId"
                    type="text"
                    placeholder="Enter token ID"
                    prefixLabel="Token ID"
                    uiType={INPUT_UI_STYLES.BLACK_WHITE}
                    errorColor={COLOR_TYPE.WARN}
                    component={Input}
                    disabled={isEdit}
                    showTitle={isEdit}
                  />
                </Col>
              </div>
              <Row>
                <Col>
                  <Field
                    name="contractAddress"
                    type="text"
                    placeholder="Enter or paste contract address"
                    prefixLabel="Contract Address"
                    uiType={INPUT_UI_STYLES.BLACK_WHITE}
                    errorColor={COLOR_TYPE.WARN}
                    component={Input}
                    showPasteButton={!isEdit}
                    disabled={isEdit}
                    showTitle={isEdit}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    name="url"
                    type="text"
                    placeholder="Enter or paste url"
                    prefixLabel="URL"
                    uiType={INPUT_UI_STYLES.BLACK_WHITE}
                    errorColor={COLOR_TYPE.WARN}
                    component={Input}
                    showPasteButton
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    name="hash"
                    type="text"
                    placeholder="Enter or paste hash"
                    prefixLabel="Hash"
                    uiType={INPUT_UI_STYLES.BLACK_WHITE}
                    errorColor={COLOR_TYPE.WARN}
                    component={Input}
                    showPasteButton
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    name="creatorUrl"
                    type="text"
                    placeholder="Enter or paste creator url"
                    prefixLabel="Creator URL"
                    uiType={INPUT_UI_STYLES.BLACK_WHITE}
                    errorColor={COLOR_TYPE.WARN}
                    component={Input}
                    showPasteButton
                  />
                </Col>
              </Row>
              <Row className="mb-n3">
                <Col className={classes.subTitleSection}>
                  Transaction Details
                </Col>
              </Row>
              <TransactionDetails
                bundles={{
                  fee: bundleCost,
                  remaining: fioAddress != null ? fioAddress.remaining : 0,
                }}
              />
              <LowBalanceBadge
                hasLowBalance={hasLowBalance}
                messageText="Not enough bundles"
              />
              <SubmitButton
                text={isEdit ? 'Update' : 'Sign NFT'}
                disabled={
                  hasLowBalance ||
                  processing ||
                  (formRenderProps.hasSubmitErrors &&
                    !formRenderProps.modifiedSinceLastSubmit) ||
                  formRenderProps.hasValidationErrors ||
                  alreadySigned ||
                  formRenderProps.submitting ||
                  (isEdit && formRenderProps.pristine) ||
                  hasFioCryptoHandleError
                }
                withTopMargin={true}
                loading={processing}
              />
            </Container>
          </form>
        );
      }}
    </Form>
  );
};

export default SignNFTForm;
