import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../utils';
import { currentFioAddress } from '../../../redux/fio/selectors';

import ListToken from './ListToken';

const reduxConnect = connect(
  createStructuredSelector({
    currentFioAddress,
  }),
  {},
);

export default compose(reduxConnect)(ListToken);
