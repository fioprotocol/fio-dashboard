import { connect } from 'react-redux';

import { compose } from '../../utils';

import { showGenericErrorModal } from '../../redux/modal/actions';

import LedgerConnect from './LedgerConnect';

const reduxConnect = connect(null, { showGenericErrorModal });

export default compose(reduxConnect)(LedgerConnect);
