import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { currentFioAddress } from '../../../redux/fio/selectors';

import AddToken from './AddToken';
import { compose } from '../../../utils';

export default compose(
  connect(
    createStructuredSelector({
      currentFioAddress,
    }),
    {},
  ),
)(AddToken);
