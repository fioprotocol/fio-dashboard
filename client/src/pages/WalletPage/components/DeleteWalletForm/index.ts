import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import DeleteWalletForm from './DeleteWalletForm';

import { edgeUsername } from '../../../../redux/profile/selectors';

import { compose } from '../../../../utils';

const reduxConnect = connect(
  createStructuredSelector({
    username: edgeUsername,
  }),
);
export default compose(reduxConnect)(DeleteWalletForm);
