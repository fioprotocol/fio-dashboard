import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import DeleteMyAccount from './DeleteMyAccount';

import { edgeUsername } from '../../../../redux/profile/selectors';

import { compose } from '../../../../utils';

const reduxConnect = connect(
  createStructuredSelector({
    username: edgeUsername,
  }),
);
export default compose(reduxConnect)(DeleteMyAccount);
