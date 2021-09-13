import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from '../../utils';
import FioAddressSignaturesPage from './FioAddressSignaturesPage';
import { withRouter } from 'react-router-dom';
import { getSignaturesFromFioAddress } from '../../redux/nftSignatures/actions';
import { nftSignatures } from '../../redux/nftSignatures/selectors';
import { email } from '../../redux/profile/selectors';

const reduxConnect = connect(
  createStructuredSelector({
    nftSignatures,
    email,
  }),
  {
    getSignaturesFromFioAddress,
    onClickSignature: () => {
      console.debug('Go to signature form');
    },
  },
);

export default withRouter(compose(reduxConnect)(FioAddressSignaturesPage));
