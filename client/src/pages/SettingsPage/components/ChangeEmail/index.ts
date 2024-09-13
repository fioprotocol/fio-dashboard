import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import ChangeEmail from './ChangeEmail';

import { compose } from '../../../../utils';

import { user } from '../../../../redux/profile/selectors';

import { loadProfile } from '../../../../redux/profile/actions';

const reduxConnect = connect(
  createStructuredSelector({
    user,
  }),
  { loadProfile },
);

export default compose(reduxConnect)(ChangeEmail);
