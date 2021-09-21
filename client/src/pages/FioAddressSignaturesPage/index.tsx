import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from '../../utils';
import FioAddressSignaturesPage from './FioAddressSignaturesPage';
import { withRouter } from 'react-router-dom';
import { getSignaturesFromFioAddress } from '../../redux/fio/actions';
import { nftSignatures } from '../../redux/fio/selectors';

const reduxConnect = connect(
  createStructuredSelector({
    nftSignatures,
  }),
  {
    getSignaturesFromFioAddress,
  },
);

export default withRouter(compose(reduxConnect)(FioAddressSignaturesPage));
