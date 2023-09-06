import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import EditIcon from '@mui/icons-material/Edit';

import PseudoModalContainer from '../../components/PseudoModalContainer';
import FioName from '../../components/common/FioName/FioName';
import NFTTokenBadge from '../../components/Badges/TokenBadge/NFTTokenBadge';
import InfoBadge from '../../components/Badges/InfoBadge/InfoBadge';
import Loader from '../../components/Loader/Loader';

import { ROUTES } from '../../constants/routes';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import { genericTokenId } from '../../util/fio';

import { NFTTokenDoublet } from '../../types';

import classes from './FioAddressSignaturesPage.module.scss';

type Props = {
  getNFTSignatures: (searchParams: { fioAddress: string }) => void;
  nftSignatures: NFTTokenDoublet[];
  loading: boolean;
  location: {
    query?: {
      address?: string;
    };
  };
};

const FioAddressSignaturesPage: React.FC<Props> = props => {
  const {
    nftSignatures,
    getNFTSignatures,
    loading,
    location: { query: { address } = {} },
  } = props;

  useEffect(() => {
    getNFTSignatures({ fioAddress: address });
  }, [address, getNFTSignatures]);

  return (
    <PseudoModalContainer
      title="NFT Signatures"
      link={ROUTES.FIO_ADDRESSES}
      fullWidth={true}
    >
      <div className={classes.container}>
        <p className={classes.subTitleSection}>
          Introducing NFT Signatures. You can now sign your NFT with your FIO
          Handle to prevent forgeries.
          <a
            href="https://fioprotocol.atlassian.net/wiki/spaces/FC/pages/113606966/NFT+Digital+Signature"
            target="_blank"
            rel="noreferrer"
          >
            {' '}
            More information...
          </a>
        </p>

        <div className={classes.actionContainer}>
          <FioName name={address} />
          <div className={classes.buttonsContainer}>
            <Link
              to={{
                pathname: ROUTES.FIO_ADDRESS_SIGN,
                search: `${QUERY_PARAMS_NAMES.ADDRESS}=${address}`,
              }}
              className={classes.link}
            >
              <Button>
                <EditIcon className={classes.icon} />
                Sign NFT
              </Button>
            </Link>
          </div>
        </div>
        <h5 className={classes.subTitle}>Signed NFTs</h5>

        <div className={classes.list}>
          {!isEmpty(nftSignatures) ? (
            nftSignatures.map(item => {
              const { chainCode, tokenId, contractAddress } = item;
              const id = genericTokenId(chainCode, tokenId, contractAddress);
              return (
                <NFTTokenBadge
                  key={id}
                  id={id}
                  chainCode={chainCode}
                  tokenId={tokenId}
                  name={address}
                  contractAddress={contractAddress}
                />
              );
            })
          ) : loading ? (
            <Loader className={classes.spinner} />
          ) : (
            <div className={classes.infoBadgeContainer}>
              <InfoBadge
                title="No Signatures"
                message="You have no NFT signatures for this"
              />
            </div>
          )}
        </div>
      </div>
    </PseudoModalContainer>
  );
};

export default FioAddressSignaturesPage;
