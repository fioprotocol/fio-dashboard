import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { nftSignatures, loading } from '../../redux/fio/selectors';
import NftValidationPage from './NftValidationPage';

const reduxConnect = connect(
  createStructuredSelector({
    nftSignatures,
    loading,
  }),
  {},
);

export default compose(reduxConnect)(NftValidationPage);
