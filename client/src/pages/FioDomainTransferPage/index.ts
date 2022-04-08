import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';

import { fioDomains, fees } from '../../redux/fio/selectors';

import { FioDomainTransferPage } from './FioDomainTransferPage';

const reduxConnect = connect(
  createStructuredSelector({
    fioNameList: fioDomains,
    fees,
  }),
  {},
);

export default withRouter(compose(reduxConnect)(FioDomainTransferPage));
