import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import FioAddressNftPage from './FioAddressNftPage';

import { fioCryptoHandles } from '../../redux/fio/selectors';

import { ReduxState } from '../../redux/init';

import { genericTokenId } from '../../util/fio';

import { NFTTokenDoublet } from '../../types';

const reduxConnect = connect(
  createStructuredSelector({
    nft: (
      state: ReduxState,
      ownProps: { match: { params: { address: string; id: string } } } & any,
    ) => {
      const {
        fio: { nftList },
      } = state;
      const {
        match: {
          params: { address, id },
        },
      } = ownProps;

      return {
        address,
        currentNft: nftList.find(
          (nftItem: NFTTokenDoublet) =>
            genericTokenId(
              nftItem.chainCode,
              nftItem.tokenId,
              nftItem.contractAddress,
            ) === id,
        ),
      };
    },
    fioCryptoHandles,
  }),
  {},
);

export default compose(reduxConnect)(FioAddressNftPage);
