import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';

import { fioCryptoHandles } from '../../redux/fio/selectors';
import FioNameRenewPage from './FioAddressRenewPage';

const reduxConnect = connect(
  createStructuredSelector({
    fioNameList: fioCryptoHandles,
  }),
  {},
);

export default withRouter(compose(reduxConnect)(FioNameRenewPage));
