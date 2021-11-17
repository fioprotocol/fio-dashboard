import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router';

import UpdateEmailConfirmGatePage from './UpdateEmailConfirmGatePage';

import { compose } from '../../utils';

import {
  user,
  isActiveUser,
  noProfileLoaded,
} from '../../redux/profile/selectors';
import { updateEmailRevert } from '../../redux/profile/actions';

const reduxConnect = connect(
  createStructuredSelector({
    user,
    isActiveUser,
    noProfileLoaded,
  }),
  { updateEmailRevert },
);

export default withRouter(compose(reduxConnect)(UpdateEmailConfirmGatePage));
