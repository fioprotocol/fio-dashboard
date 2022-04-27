import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';

import { fioAddresses, fees } from '../../redux/fio/selectors';

import { FioAddressTransferPage } from './FioAddressTransferPage';

const reduxConnect = connect(
  createStructuredSelector({
    fioNameList: fioAddresses,
    fees,
  }),
  {},
);

export default withRouter(compose(reduxConnect)(FioAddressTransferPage));
