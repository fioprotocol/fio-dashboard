import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  resetTransactionResult,
  RENEW_REQUEST,
} from '../../../redux/fio/actions';
import FioNameRenewResults from './FioNameRenewResults';

export default withRouter(
  connect(null, {
    resetTransactionResult: () => resetTransactionResult(RENEW_REQUEST),
  })(FioNameRenewResults),
);
