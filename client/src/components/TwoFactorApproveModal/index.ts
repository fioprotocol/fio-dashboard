import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { user } from '../../redux/profile/selectors';

import TwoFactorApproveModal from './TwoFactorApproveModal';

const reduxConnect = connect(
  createStructuredSelector({
    user,
  }),
);

export default compose(reduxConnect)(TwoFactorApproveModal);
