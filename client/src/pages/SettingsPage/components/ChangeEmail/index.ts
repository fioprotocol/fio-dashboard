import ChangeEmail from './ChangeEmail';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../../../utils';

import { user } from '../../../../redux/profile/selectors';

import { updateEmailRequest } from '../../../../redux/profile/actions';

const reduxConnect = connect(
  createStructuredSelector({
    user,
  }),
  { updateEmailRequest },
);

export default compose(reduxConnect)(ChangeEmail);
