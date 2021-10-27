import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getNFTSignatures, clearNFTSignatures } from '../../redux/fio/actions';
import { nftSignatures, loading } from '../../redux/fio/selectors';
import NftValidationPage from './NftValidationPage';

const reduxConnect = connect(
  createStructuredSelector({
    nftSignatures,
    loading,
  }),
  { getNFTSignatures, clearNFTSignatures },
);

export default compose(reduxConnect)(NftValidationPage);
