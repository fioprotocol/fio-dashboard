import ChangeEmail from './ChangeEmail';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../../utils';

import { loading, user } from '../../../../redux/profile/selectors';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    user,
  }),
  {},
);

export default compose(reduxConnect)(ChangeEmail);
