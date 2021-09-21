import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './FioAddressSignaturesPage.module.scss';

type Props = {
  chainCode: string;
  tokenId: string;
  contractAddress: string;
};

const FioAddressSignatureItem: React.FC<Props> = props => {
  const { chainCode, tokenId, contractAddress } = props;

  return (
    <Row key={`signature-${uuidv4()}`} className={classes.signatureItem}>
      <Col lg="auto" className={classes.signatureItemText}>
        Chain code:{' '}
        <span className={classes.signatureItemTextValue}>{chainCode}</span>
      </Col>
      <Col lg="auto" className={classes.signatureItemText}>
        Token ID:{' '}
        <span className={classes.signatureItemTextValue}>{tokenId}</span>
      </Col>
      <Col lg="auto" className={classes.signatureItemText}>
        Contract Address:{' '}
        <span className={classes.signatureItemTextValue}>
          {contractAddress}
        </span>
      </Col>
      <Col lg="auto">
        <FontAwesomeIcon icon="chevron-right" className={classes.icon} />
      </Col>
    </Row>
  );
};

export default FioAddressSignatureItem;
