import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { NftItem } from '@fioprotocol/fiosdk/src/entities/NftItem';
import classes from './SignNft.module.scss';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import apis from '../../api/index';
import Input, { INPUT_UI_STYLES } from '../../components/Input/Input';
import PseudoModalContainer from '../PseudoModalContainer';
import BundledTransactionBadge from '../Badges/BundledTransactionBadge/BundledTransactionBadge';
import { ContainerProps, NftFormValues } from './types';
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
import { BADGE_TYPES } from '../Badge/Badge';
import InfoBadge from '../InfoBadge/InfoBadge';

const BUNDLE_COST = 2;

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
  const [alreadySigned, setAlreadySigned] = useState<boolean>(false);
  const [selectedFioAddressName, setSelectedFioAddress] = useState<string>(
    fioAddressName,
  );
  const fioAddress = fioAddresses.find(
    ({ name }) => name === selectedFioAddressName,
  );
  const checkNftSigned = async (chainCode: string, contractAddress: string) => {
    const { nfts } = await apis.fio.checkNftSigned(chainCode, contractAddress);
    setAlreadySigned(nfts.length > 0);
    return nfts.length > 0;
  };

  useEffect(() => {
    getFee(fioAddressName);
    if (
      initialValues != null &&
      initialValues.chain_code &&
      initialValues.contract_address
    ) {
      checkNftSigned(initialValues.chain_code, initialValues.contract_address);
    }
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

  const fieldValuesChanged = () => {
    if (alreadySigned) {
      setAlreadySigned(false);
    }
  };

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

  const onSubmit = async (values: NftFormValues) => {
    const nftSigned = await checkNftSigned(
      values.chain_code,
      values.contract_address,
    );
    if (nftSigned) return;
    showPinModal(CONFIRM_PIN_ACTIONS.SIGN_NFT, {
      chain_code: values.chain_code,
      contract_address: values.contract_address,
      token_id: values.token_id || '',
      url: values.url || '',
      hash: values.hash || '',
      metadata: { creator_url: values.creator_url || '' },
    });
  };

  const hasLowBalance =
    fioAddress != null ? fioAddress.remaining < BUNDLE_COST : true;

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
            <OnChange name="chain_code">{fieldValuesChanged}</OnChange>
            <OnChange name="contract_address">{fieldValuesChanged}</OnChange>
            <Container fluid className={classes.signSection}>
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
              <Row>
                <Col>
                  <Field
                    name="chain_code"
                    type="text"
                    placeholder="Enter chain code"
                    prefixLabel="Chain Code"
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
                    prefixLabel="Token ID"
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
                    prefixLabel="Contract Address"
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
                    name="creator_url"
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
                bundles={BUNDLE_COST}
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
                      alreadySigned
                    }
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
