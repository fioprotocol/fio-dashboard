import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from '../../utils';
import FioAddressSign from './FioAddressSign';
import { withRouter } from 'react-router-dom';
import { singNFT } from '../../redux/nftSignatures/actions';
import { email } from '../../redux/profile/selectors';

const reduxConnect = connect(
  createStructuredSelector({
    email,
  }),
  {
    singNFT,
  },
);

export default withRouter(compose(reduxConnect)(FioAddressSign));
