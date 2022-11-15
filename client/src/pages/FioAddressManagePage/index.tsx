import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getFee, getFioAddresses } from '../../redux/fio/actions';
import { addItem as addItemToCart } from '../../redux/cart/actions';

import { fioAddresses, hasMoreAddresses } from '../../redux/fio/selectors';
import { fioWallets, loading } from '../../redux/fio/selectors';
import { noProfileLoaded } from '../../redux/profile/selectors';
import { cartItems } from '../../redux/cart/selectors';

import FioAddressManagePage from './FioAddressManagePage';

import apis from '../../api';

import { DEFAULT_FEE_PRICES } from '../../util/prices';

import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    fioNameList: fioAddresses,
    fioWallets,
    hasMore: hasMoreAddresses,
    loading,
    noProfileLoaded,
    cartItems,
    addBundlesFeePrice: (state: ReduxState) => {
      const { fees } = state.fio;
      return (
        fees[apis.fio.actionEndPoints.addBundledTransactions] ||
        DEFAULT_FEE_PRICES
      );
    },
  }),
  {
    getWalletAddresses: getFioAddresses,
    getAddBundlesFee: () =>
      getFee(apis.fio.actionEndPoints.addBundledTransactions),
    addItemToCart,
  },
);

export default compose(reduxConnect)(FioAddressManagePage);
