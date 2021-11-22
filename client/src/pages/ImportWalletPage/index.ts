import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { showGenericErrorModal } from '../../redux/modal/actions';
import { addWallet } from '../../redux/account/actions';

import { fioWallets, loading } from '../../redux/fio/selectors';
import { noProfileLoaded } from '../../redux/profile/selectors';
import { addWalletLoading } from '../../redux/account/selectors';

import ImportWalletPage from './ImportWalletPage';

const reduxConnect = connect(
  createStructuredSelector({
    fioWallets,
    loading,
    addWalletLoading,
    noProfileLoaded,
  }),
  { showGenericErrorModal, addWallet },
);

export default compose(reduxConnect)(ImportWalletPage);
