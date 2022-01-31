import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { fioAddresses } from '../../redux/fio/selectors';
import { getFioAddresses } from '../../redux/fio/actions';

import RejectFioRequestPage from './RejectFioRequestPage';

const reduxConnect = connect(createStructuredSelector({ fioAddresses }), {
  getFioAddresses,
});

export default compose(reduxConnect)(RejectFioRequestPage);
