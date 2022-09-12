import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { currentFioAddress, fioWallets } from '../../redux/fio/selectors';

import EditTokenPage from './EditTokenPage';

const reduxConnect = connect(
  createStructuredSelector({
    fioCryptoHandle: currentFioAddress,
    fioWallets,
  }),
  {},
);

export default compose(reduxConnect)(EditTokenPage);
