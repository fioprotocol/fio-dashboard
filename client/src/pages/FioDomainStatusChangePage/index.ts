import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';

import { compose } from '../../utils';

import { fioDomains } from '../../redux/fio/selectors';
import FioDomainStatusChangePage from './FioDomainStatusChangePage';

const reduxConnect = connect(
  createStructuredSelector({
    fioNameList: fioDomains,
  }),
  {},
);

export default withRouter(compose(reduxConnect)(FioDomainStatusChangePage));
