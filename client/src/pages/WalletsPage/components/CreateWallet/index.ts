import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { fioWallets } from '../../../../redux/fio/selectors';
import { addWalletLoading } from '../../../../redux/account/selectors';
import {
  showGenericError,
  showPinConfirm,
} from '../../../../redux/modal/selectors';
import { user } from '../../../../redux/profile/selectors';

import { addWallet } from '../../../../redux/account/actions';

import { compose } from '../../../../utils';

import CreateWallet from './CreateWallet';

const reduxConnect = connect(
  createStructuredSelector({
    fioWallets,
    genericErrorModalIsActive: showGenericError,
    addWalletLoading,
    pinModalIsOpen: showPinConfirm,
    user,
  }),
  {
    addWallet,
  },
);
export default compose(reduxConnect)(CreateWallet);
