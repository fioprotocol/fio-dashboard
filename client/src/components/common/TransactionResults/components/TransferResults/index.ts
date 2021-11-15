import { connect } from 'react-redux';

import { resetFioNames } from '../../../../../redux/fio/actions';

import TransferResults from './TransferResults';

export default connect(null, {
  resetFioNames,
})(TransferResults);
