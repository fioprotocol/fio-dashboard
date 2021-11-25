import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { showGenericError } from '../../../../redux/modal/selectors';

import { updateWalletName } from '../../../../redux/account/actions';
import { showGenericErrorModal } from '../../../../redux/modal/actions';

import { compose } from '../../../../utils';

import EditWalletName from './EditWalletName';

const reduxConnect = connect(
  createStructuredSelector({
    genericErrorModalIsActive: showGenericError,
  }),
  {
    updateWalletName,
    showGenericErrorModal,
  },
);
export default compose(reduxConnect)(EditWalletName);
