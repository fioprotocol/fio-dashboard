import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';
import FioAddressSignaturesPage from './FioAddressSignaturesPage';
import { getNFTSignatures } from '../../redux/fio/actions';
import { nftSignatures, loading } from '../../redux/fio/selectors';

const reduxConnect = connect(
  createStructuredSelector({
    nftSignatures,
    loading,
  }),
  {
    getNFTSignatures,
  },
);

export default withRouter(compose(reduxConnect)(FioAddressSignaturesPage));
