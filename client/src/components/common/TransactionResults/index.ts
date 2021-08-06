import { connect } from 'react-redux';

import { resetTransactionResult } from '../../../redux/fio/actions';

import Results from './Results';

export default connect(null, {
  resetTransactionResult: (actionName: string) =>
    resetTransactionResult(actionName),
})(Results);
