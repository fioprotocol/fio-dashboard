import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { edgeUsername, user } from '../../../../redux/profile/selectors';
import { logout, resetLastAuthData } from '../../../../redux/profile/actions';
import {
  closeGenericSuccessModal,
  showGenericSuccessModal,
  showGenericErrorModal,
} from '../../../../redux/modal/actions';
import { compose } from '../../../../utils';

import DeleteMyAccount from './DeleteMyAccount';

import { AppDispatch } from '../../../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    username: edgeUsername,
    user,
  }),
  (dispatch: AppDispatch) => ({
    logout: () => {
      dispatch(logout({ redirect: '/?logout=silent' }));
      dispatch(resetLastAuthData());
    },
    closeSuccessModal: () => {
      dispatch(closeGenericSuccessModal());
    },
    showSuccessModal: (message: string, title: string, timeout?: number) => {
      dispatch(showGenericSuccessModal(message, title, undefined, timeout));
    },
    showGenericErrorModal: () => {
      dispatch(showGenericErrorModal());
    },
  }),
);

export default compose(reduxConnect)(DeleteMyAccount);
