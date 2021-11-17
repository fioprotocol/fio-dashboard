import ChangeEmail from './ChangeEmail';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../../utils';

import { loading, user } from '../../../../redux/profile/selectors';

import { updateEmailRequest } from '../../../../redux/profile/actions';

const reduxConnect = connect(
  createStructuredSelector({
    loading,
    user,
  }),
  { updateEmailRequest },
);

export default compose(reduxConnect)(ChangeEmail);
