import React, { useEffect } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { NftItem } from '@fioprotocol/fiosdk/src/entities/NftItem';
import classes from './SignNft.module.scss';
import { Field, Form, FormRenderProps } from 'react-final-form';
import Input, { INPUT_UI_STYLES } from '../../components/Input/Input';
import { ROUTES } from '../../constants/routes';
import PseudoModalContainer from '../PseudoModalContainer';
import BundledTransactionBadge from '../Badges/BundledTransactionBadge/BundledTransactionBadge';
import { ContainerProps } from './types';
import LowBalanceBadge from '../Badges/LowBalanceBadge/LowBalanceBadge';

const SignNft: React.FC<ContainerProps> = props => {
  const {
    singNFT,
    fioAddresses,
    match: {
      params: { address },
    },
    refreshBalance,
    getFee,
  } = props;
  const fioAddress = fioAddresses.find(({ name }) => name === address);

  useEffect(() => {
    getFee(address);
  }, []);

  useEffect(() => {
    if (fioAddress != null) refreshBalance(fioAddress.walletPublicKey);
  }, [fioAddress]);

  const bundleCost = 2;
  const hasLowBalance =
    fioAddress != null ? fioAddress.remaining < bundleCost : true;

  return (
    <PseudoModalContainer
      title="Sign NFT"
      link={`${ROUTES.FIO_ADDRESS_SIGNATURES}`.replace(':address', address)}
      fullWidth={true}
    >
      <Form onSubmit={(values: NftItem) => singNFT(address, [{ ...values }])}>
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
                    <div>{address}</div>
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
                    component={Input}
                    hideError="true"
                  />
                </Col>
                <Col>
                  <Field
                    name="token_id"
                    type="text"
                    placeholder="Enter token ID"
                    uiType={INPUT_UI_STYLES.BLACK_WHITE}
                    component={Input}
                    hideError="true"
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
                    component={Input}
                    hideError="true"
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
                    component={Input}
                    hideError="true"
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
                    component={Input}
                    hideError="true"
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
                    component={Input}
                    hideError="true"
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
                    disabled={hasLowBalance}
                  >
                    <span>Sign NFT</span>
                  </Button>
                </Col>
              </Row>
            </Container>
          </form>
        )}
      </Form>
    </PseudoModalContainer>
  );
};

export default SignNft;
