import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './FioAddressSignaturesPage.module.scss';
import { NFTSignature } from '../../types';
import { ROUTES } from '../../constants/routes';
import FioName from '../../components/common/FioName/FioName';
import FioAddressSignatureItem from './FioAddressSignatureItem';

type Props = {
  getSignaturesFromFioAddress: (fioAddress: string) => void;
  nftSignatures: NFTSignature[];
  match: {
    params: { address: string };
  };
};

const FioAddressSignaturesPage: React.FC<Props> = props => {
  const {
    nftSignatures,
    getSignaturesFromFioAddress,
    match: {
      params: { address },
    },
  } = props;
  useEffect(() => {
    getSignaturesFromFioAddress(address);
  }, [getSignaturesFromFioAddress]);
  return (
    <PseudoModalContainer
      title="NFT Signatures"
      link={ROUTES.FIO_ADDRESSES}
      hasAutoWidth={true}
    >
      <div className={classes.container}>
        <p className={classes.subTitleSection}>
          NFT signature information of all your signed done.
          <a href="#"> More information...</a>
        </p>

        <div className={classes.actionContainer}>
          <FioName name={address} />
          <div className={classes.buttonsContainer}>
            <Link to={ROUTES.FIO_ADDRESS_SIGN} className={classes.link}>
              <Button>
                <FontAwesomeIcon icon="pen" className={classes.icon} /> Sign NFT
              </Button>
            </Link>
          </div>
        </div>
        <h5 className={classes.subTitle}>Signed NFTs</h5>

        <div className={classes.list}>
          {nftSignatures &&
            nftSignatures.map((item: NFTSignature) => (
              <FioAddressSignatureItem {...item} />
            ))}
        </div>
      </div>
    </PseudoModalContainer>
  );
};

export default FioAddressSignaturesPage;
