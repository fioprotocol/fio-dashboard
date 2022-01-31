import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { fioAddresses } from '../../redux/fio/selectors';

import RejectFioRequestPage from './RejectFioRequestPage';

const reduxConnect = connect(createStructuredSelector({ fioAddresses }));

export default compose(reduxConnect)(RejectFioRequestPage);
