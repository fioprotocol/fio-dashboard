import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { NftItem } from '@fioprotocol/fiosdk/src/entities/NftItem';
import classes from './SignNft.module.scss';
import { Field, Form, FormRenderProps } from 'react-final-form';
import Input, { INPUT_COLOR_SCHEMA } from '../../components/Input/Input';

type Props = {
  singNFT: (publicKey: string, nfts: NftItem[]) => void;
  match: {
    params: { address: string };
  };
};

const SignNft: React.FC<Props> = props => {
  const {
    singNFT,
    match: {
      params: { address },
    },
  } = props;
  return (
    <>
      <Form onSubmit={(values: NftItem) => singNFT(address, [{ ...values }])}>
        {(props: FormRenderProps) => (
          <form onSubmit={props.handleSubmit}>
            <Container fluid className={classes.signSection}>
              <Row>
                <Col className={classes.mainTitleSection}>Sign NFT</Col>
              </Row>
              <Row>
                <Col className={classes.subTitleSection}>Details</Col>
              </Row>
              <Row>
                <Col className={classes.subTitleSection}>
                  <div className={classes.fioAddress}>
                    FIO Address {address}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    name="chain_code"
                    type="text"
                    placeholder="Enter chain code"
                    colorSchema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
                    component={Input}
                    hideError="true"
                  />
                </Col>
                <Col>
                  <Field
                    name="token_id"
                    type="text"
                    placeholder="Enter token ID"
                    colorSchema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
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
                    colorSchema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
                    component={Input}
                    hideError="true"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    name="url"
                    type="text"
                    placeholder="Enter or paste url"
                    colorSchema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
                    component={Input}
                    hideError="true"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    name="hash"
                    type="text"
                    placeholder="Enter or paste hash"
                    colorSchema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
                    component={Input}
                    hideError="true"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    name="metadata"
                    type="text"
                    placeholder="Enter or paste creator url"
                    colorSchema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
                    component={Input}
                    hideError="true"
                  />
                </Col>
              </Row>
              <Row>
                <Col className={classes.subTitleSection}>Transaction cost</Col>
              </Row>
              <Row>
                <Col>
                  <div className={classes.transactionAmount}>
                    Bundle Transaction 2 Bundles
                    <span className={classes.bundleInfo}> (2 Remaining)</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={10}>
                  <Button className={classes.actionButton} type="submit">
                    <span>Sign NFT</span>
                  </Button>
                </Col>
              </Row>
            </Container>
          </form>
        )}
      </Form>
    </>
  );
};

export default SignNft;
