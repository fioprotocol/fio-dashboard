import { connect } from 'react-redux';

import { compose } from '../../../../../utils';
import {
  getFioAddresses,
  updatePublicAddresses,
} from '../../../../../redux/fio/actions';

import LinkTokenListResults from './LinkTokenListResults';

const reduxConnect = connect(null, {
  getFioAddresses,
  updatePublicAddresses,
});

export default compose(reduxConnect)(LinkTokenListResults);
