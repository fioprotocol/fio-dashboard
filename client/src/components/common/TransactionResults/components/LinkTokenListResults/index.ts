import { connect } from 'react-redux';

import { compose } from '../../../../../utils';
import {
  getFioCryptoHandles,
  updatePublicAddresses,
} from '../../../../../redux/fio/actions';

import LinkTokenListResults from './LinkTokenListResults';

const reduxConnect = connect(null, {
  getFioCryptoHandles,
  updatePublicAddresses,
});

export default compose(reduxConnect)(LinkTokenListResults);
