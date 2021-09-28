import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { NftItem } from '@fioprotocol/fiosdk/src/entities/NftItem';
import classes from './SignNft.module.scss';
import { Field, Form, FormRenderProps } from 'react-final-form';
import Input, { INPUT_UI_STYLES } from '../../components/Input/Input';
import PseudoModalContainer from '../PseudoModalContainer';
import BundledTransactionBadge from '../Badges/BundledTransactionBadge/BundledTransactionBadge';
import { ContainerProps } from './types';
import LowBalanceBadge from '../Badges/LowBalanceBadge/LowBalanceBadge';
import { PinConfirmation } from '../../types';
import { CONFIRM_PIN_ACTIONS } from '../../constants/common';
import { waitForEdgeAccountStop } from '../../utils';
import Results from '../common/TransactionResults';
import { FIO_SIGN_NFT_REQUEST } from '../../redux/fio/actions';
import { ResultsData } from '../common/TransactionResults/types';
import Processing from '../common/TransactionProcessing';
import CustomDropdown from './CustomDropdown';
import { validate } from './validation';
import { COLOR_TYPE } from '../Input/ErrorBadge';

const SignNft: React.FC<ContainerProps> = props => {
  const {
    backTo,
    initialValues,
    singNFT,
    fioAddresses,
    fioWallets,
    fioAddressName,
    refreshBalance,
    pinConfirmation,
    showPinModal,
    resetPinConfirm,
    signNftProcessing,
    getFee,
    result,
  } = props;
  const [processing, setProcessing] = useState(false);
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [selectedFioAddressName, setSelectedFioAddress] = useState<string>(
    fioAddressName,
  );
  const fioAddress = fioAddresses.find(
    ({ name }) => name === selectedFioAddressName,
  );

  useEffect(() => {
    getFee(fioAddressName);
  }, []);

  useEffect(() => {
    if (fioAddress != null) refreshBalance(fioAddress.walletPublicKey);
  }, [fioAddress]);

  // Handle pin confirmation
  useEffect(() => {
    submit(pinConfirmation);
  }, [pinConfirmation]);

  // Handle results
  useEffect(() => {
    if (!signNftProcessing && processing) {
      resetPinConfirm();

      // TODO: set proper results
      setResultsData({
        name: fioAddressName,
        error: result.error,
      });
      setProcessing(false);
    }
  }, [signNftProcessing, result]);

  const submit = async (pinConfirmation: PinConfirmation) => {
    const {
      account: edgeAccount,
      keys: walletKeys,
      error: confirmationError,
      action: confirmationAction,
    } = pinConfirmation;

    if (confirmationAction !== CONFIRM_PIN_ACTIONS.SIGN_NFT) return;
    const currentWallet = fioWallets.find(
      ({ publicKey }) => publicKey === fioAddress.walletPublicKey,
    );
    if (
      walletKeys &&
      walletKeys[currentWallet.id] &&
      !confirmationError &&
      !signNftProcessing &&
      !processing
    ) {
      setProcessing(true);
      await waitForEdgeAccountStop(edgeAccount);
      const { data }: { data?: NftItem } = pinConfirmation;
      singNFT(fioAddressName, [{ ...data }], walletKeys[currentWallet.id]);
    }

    if (confirmationError) setProcessing(false);
  };

  const onSubmit = (values: NftItem) => {
    showPinModal(CONFIRM_PIN_ACTIONS.SIGN_NFT, {
      chain_code: values.chain_code,
      contract_address: values.contract_address,
      token_id: values.token_id || '',
      url: values.url || '',
      hash: values.hash || '',
      metadata: values.metadata || '',
    });
  };

  const bundleCost = 2;
  const hasLowBalance =
    fioAddress != null ? fioAddress.remaining < bundleCost : true;

  // TODO: show proper results
  if (resultsData)
    return (
      <Results
        results={resultsData}
        title={resultsData.error ? 'Failed!' : 'Signed!'}
        actionName={FIO_SIGN_NFT_REQUEST}
        onClose={() => {}}
        onRetry={() => {}}
      />
    );

  return (
    <PseudoModalContainer
      title="Sign NFT"
      link={backTo || null}
      fullWidth={true}
    >
      <Form
        onSubmit={onSubmit}
        validate={validate}
        initialValues={initialValues}
      >
        {(props: FormRenderProps) => (
          <form onSubmit={props.handleSubmit}>
            <Container fluid className={classes.signSection}>
              <Row className="mt-2">
                <Col className={classes.subTitleSection}>Details</Col>
              </Row>
              <Row>
                <Col className={classes.subTitleSection}>
                  <div
                    className={`${classes.fioAddress} d-flex justify-content-start`}
                  >
                    <div>FIO Address</div>
                    <CustomDropdown
                      value={selectedFioAddressName}
                      list={fioAddresses.map(({ name }) => name)}
                      onChange={setSelectedFioAddress}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    name="chain_code"
                    type="text"
                    placeholder="Enter chain code"
                    uiType={INPUT_UI_STYLES.BLACK_WHITE}
                    errorColor={COLOR_TYPE.WARN}
                    component={Input}
                  />
                </Col>
                <Col>
                  <Field
                    name="token_id"
                    type="text"
                    placeholder="Enter token ID"
                    uiType={INPUT_UI_STYLES.BLACK_WHITE}
                    errorColor={COLOR_TYPE.WARN}
                    component={Input}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    name="contract_address"
                    type="text"
                    placeholder="Enter or paste contract address"
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
                    name="url"
                    type="text"
                    placeholder="Enter or paste url"
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
                    name="metadata"
                    type="text"
                    placeholder="Enter or paste creator url"
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
                    disabled={hasLowBalance || processing}
                  >
                    <span>Sign NFT</span>
                  </Button>
                </Col>
              </Row>
            </Container>
          </form>
        )}
      </Form>
      <Processing isProcessing={processing} />
    </PseudoModalContainer>
  );
};

export default SignNft;
