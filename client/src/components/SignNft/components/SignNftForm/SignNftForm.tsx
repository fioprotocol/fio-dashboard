import React from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { Button, Col, Container, Row } from 'react-bootstrap';

import InfoBadge from '../../../InfoBadge/InfoBadge';
import { BADGE_TYPES } from '../../../Badge/Badge';
import CustomDropdown from '../CustomDropdown';
import Input, { INPUT_UI_STYLES } from '../../../Input/Input';
import { COLOR_TYPE } from '../../../Input/ErrorBadge';
import BundledTransactionBadge from '../../../Badges/BundledTransactionBadge/BundledTransactionBadge';
import LowBalanceBadge from '../../../Badges/LowBalanceBadge/LowBalanceBadge';
import FioName from '../../../common/FioName/FioName';

import { validate } from './validation';

import classes from '../../SignNft.module.scss';

import { SignNftFormProps } from '../../types';

const SignNFTForm = (props: SignNftFormProps) => {
  const {
    onSubmit,
    initialValues,
    fieldValuesChanged,
    alreadySigned,
    selectedFioAddressName,
    fioAddresses,
    setSelectedFioAddress,
    bundleCost,
    hasLowBalance,
    processing,
    fioAddress,
    isEdit,
    addressSelectOff,
  } = props;

  return (
    <Form onSubmit={onSubmit} validate={validate} initialValues={initialValues}>
      {(props: FormRenderProps) => (
        <form onSubmit={props.handleSubmit}>
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
                <Row className="mt-4">
                  <Col className={classes.subTitleSection}>Details</Col>
                </Row>
                <Row>
                  <Col className={classes.subTitleSection}>
                    <div
                      className={`${classes.fioAddress} d-flex justify-content-start`}
                    >
                      <div className={classes.fioAddressLabel}>FIO Address</div>
                      <CustomDropdown
                        value={selectedFioAddressName}
                        list={fioAddresses.map(({ name }) => name)}
                        onChange={setSelectedFioAddress}
                      />
                    </div>
                  </Col>
                </Row>
              </>
            ) : (
              <div className="mt-3 mb-4">
                <FioName name={fioAddress.name} />
                <Row className="mt-4">
                  <Col className={classes.subTitleSection}>
                    Signed NFT Details
                  </Col>
                </Row>
              </div>
            )}
            <Row>
              <Col>
                <Field
                  name="chainCode"
                  type="text"
                  placeholder="Enter chain code"
                  prefixLabel="Chain Code"
                  uiType={INPUT_UI_STYLES.BLACK_WHITE}
                  errorColor={COLOR_TYPE.WARN}
                  component={Input}
                  disabled={isEdit}
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
                />
              </Col>
            </Row>
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
                  showCopyButton={!isEdit}
                  disabled={isEdit}
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
                  showCopyButton
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
                  showCopyButton
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
                  showCopyButton
                />
              </Col>
            </Row>
            <Row className="mb-n3">
              <Col className={classes.subTitleSection}>Transaction cost</Col>
            </Row>
            <BundledTransactionBadge
              bundles={bundleCost}
              remaining={fioAddress != null ? fioAddress.remaining : 0}
            />
            <LowBalanceBadge
              hasLowBalance={hasLowBalance}
              messageText="Not enough bundles"
            />
            <Row>
              <Col className="text-center">
                <Button
                  className={classes.actionButton}
                  type="submit"
                  disabled={
                    hasLowBalance ||
                    processing ||
                    !props.valid ||
                    alreadySigned ||
                    props.submitting ||
                    (isEdit && props.pristine)
                  }
                >
                  <span>{isEdit ? 'Update' : 'Sign NFT'}</span>
                </Button>
              </Col>
            </Row>
          </Container>
        </form>
      )}
    </Form>
  );
};

export default SignNFTForm;
