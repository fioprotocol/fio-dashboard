import { withRouter } from 'react-router-dom';

import {
  resetTransactionResult,
  TRANSFER_REQUEST,
} from '../../../redux/fio/actions';
import FioNameTransferResults from './FioNameTransferResults';
import { connect } from 'react-redux';

export default withRouter(
  connect(null, {
    resetTransactionResult: () => resetTransactionResult(TRANSFER_REQUEST),
  })(FioNameTransferResults),
);
