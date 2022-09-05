import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';
import { currentFioAddress, fioWallets } from '../../redux/fio/selectors';

import DeleteTokenPage from './DeleteTokenPage';

const reduxConnect = connect(
  createStructuredSelector({
    fioCryptoHandle: currentFioAddress,
    fioWallets,
  }),
  {},
);

export default compose(reduxConnect)(DeleteTokenPage);
