import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';

import { fioAddresses } from '../../redux/fio/selectors';
import { FioAddressTransferPage } from './FioAddressTransferPage';

const reduxConnect = connect(
  createStructuredSelector({
    fioNameList: fioAddresses,
  }),
  {},
);

export default withRouter(compose(reduxConnect)(FioAddressTransferPage));
