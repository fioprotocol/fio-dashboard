import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import ChangeEmail from './ChangeEmail';

import { compose } from '../../../../utils';

import { user, updateEmailLoading } from '../../../../redux/profile/selectors';
import { showPinConfirm } from '../../../../redux/modal/selectors';

import { updateEmailRequest } from '../../../../redux/profile/actions';

const reduxConnect = connect(
  createStructuredSelector({
    user,
    pinModalIsOpen: showPinConfirm,
    loading: updateEmailLoading,
  }),
  { updateEmailRequest },
);

export default compose(reduxConnect)(ChangeEmail);
