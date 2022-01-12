import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { currentFioCryptoHandle } from '../../redux/fio/selectors';

import AddTokenPage from './AddTokenPage';
import { compose } from '../../utils';

export default compose(
  connect(
    createStructuredSelector({
      fioCryptoHandle: currentFioCryptoHandle,
    }),
    {},
  ),
)(AddTokenPage);
