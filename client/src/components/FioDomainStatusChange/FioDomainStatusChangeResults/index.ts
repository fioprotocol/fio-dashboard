import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  resetTransactionResult,
  SET_VISIBILITY_REQUEST,
} from '../../../redux/fio/actions';
import FioDomainStatusChangeResults from './FioDomainStatusChangeResults';

export default withRouter(
  connect(null, {
    resetTransactionResult: () =>
      resetTransactionResult(SET_VISIBILITY_REQUEST),
  })(FioDomainStatusChangeResults),
);
