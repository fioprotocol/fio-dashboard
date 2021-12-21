import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { loadProfile } from '../../redux/profile/actions';

import { user } from '../../redux/profile/selectors';

import TwoFactorApproveModal from './TwoFactorApproveModal';

const reduxConnect = connect(
  createStructuredSelector({
    user,
  }),
  { loadProfile },
);

export default compose(reduxConnect)(TwoFactorApproveModal);
