import React from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import classes from './FioAddressSign.module.scss';
import { Field, Form } from 'react-final-form';
import Input, { INPUT_COLOR_SCHEMA } from '../../components/Input/Input';
import { NftItem } from '@fioprotocol/fiosdk/src/entities/NftItem';

type Props = {
  singNFT: (publicKey: string, nfts: NftItem[]) => void;
  email: string;
  match: {
    params: { address: string };
  };
};

const FioAddressSign: React.FC<Props> = props => {
  const {
    singNFT,
    email,
    match: {
      params: { address },
    },
  } = props;
  return (
    <>
      <Form onSubmit={(values: NftItem) => singNFT(address, [{ ...values }])}>
        {/* tslint:disable-next-line:no-shadowed-variable */}
        {props => (
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
                  <div className={classes.fioAddress}>FIO Address {email}</div>
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

export default FioAddressSign;
