import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import FioAddressNftPage from './FioAddressNftPage';

import { fioAddresses } from '../../redux/fio/selectors';

import { ReduxState } from '../../redux/init';

import { nftId } from '../../util/nft';

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
            nftId(
              nftItem.chainCode,
              nftItem.tokenId,
              nftItem.contractAddress,
            ) === id,
        ),
      };
    },
    fioAddresses,
  }),
  {},
);

export default compose(reduxConnect)(FioAddressNftPage);
