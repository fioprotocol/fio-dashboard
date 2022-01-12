import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { currentFioCryptoHandle } from '../../redux/fio/selectors';

import EditTokenPage from './EditTokenPage';

const reduxConnect = connect(
  createStructuredSelector({
    fioCryptoHandle: currentFioCryptoHandle,
  }),
  {},
);

export default compose(reduxConnect)(EditTokenPage);
