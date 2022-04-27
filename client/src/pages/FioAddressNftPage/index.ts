import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { RouteComponentProps } from 'react-router-dom';

import { compose } from '../../utils';
import FioAddressNftPage from './FioAddressNftPage';

import { fioAddresses } from '../../redux/fio/selectors';

import { ReduxState } from '../../redux/init';

import { genericTokenId } from '../../util/fio';

import { NFTTokenDoublet, OwnPropsAny } from '../../types';

const reduxConnect = connect(
  createStructuredSelector({
    nft: (
      state: ReduxState,
      ownProps: RouteComponentProps<{ address: string; id: string }> &
        OwnPropsAny,
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
    fioAddresses,
  }),
  {},
);

export default compose(reduxConnect)(FioAddressNftPage);
