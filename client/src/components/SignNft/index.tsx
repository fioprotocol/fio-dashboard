import { connect } from 'react-redux';
import { compose } from '../../utils';
import SignNft from './SignNft';
import { withRouter } from 'react-router-dom';
import { singNFT } from '../../redux/fio/actions';

const reduxConnect = connect(null, {
  singNFT,
});

export default withRouter(compose(reduxConnect)(SignNft));
