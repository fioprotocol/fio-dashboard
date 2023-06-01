import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { loadProfile } from '../../redux/profile/actions';

import { isAuthenticated, user } from '../../redux/profile/selectors';

import TwoFactorApproveModal from './TwoFactorApproveModal';

const reduxConnect = connect(
  createStructuredSelector({
    isAuthenticated,
    user,
  }),
  { loadProfile },
);

export default compose(reduxConnect)(TwoFactorApproveModal);
