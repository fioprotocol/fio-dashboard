import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { compose } from '../../utils';

import { getFee, getFioDomains } from '../../redux/fio/actions';
import { addItem as addItemToCart } from '../../redux/cart/actions';

import { fioDomains, hasMoreDomains } from '../../redux/fio/selectors';
import { fioWallets, loading } from '../../redux/fio/selectors';
import { noProfileLoaded } from '../../redux/profile/selectors';
import { cartItems } from '../../redux/cart/selectors';

import FioDomainManagePage from './FioDomainManagePage';

import apis from '../../api';

import { DEFAULT_FEE_PRICES } from '../../util/prices';

import { ReduxState } from '../../redux/init';

const reduxConnect = connect(
  createStructuredSelector({
    fioNameList: fioDomains,
    fioWallets,
    hasMore: hasMoreDomains,
    loading,
    noProfileLoaded,
    cartItems,
    renewDomainFeePrice: (state: ReduxState) => {
      const { fees } = state.fio;
      return (
        fees[apis.fio.actionEndPoints.renewFioDomain] || DEFAULT_FEE_PRICES
      );
    },
  }),
  {
    getWalletAddresses: getFioDomains,
    getRenewDomainFee: () => getFee(apis.fio.actionEndPoints.renewFioDomain),
    addItemToCart,
  },
);

export default compose(reduxConnect)(FioDomainManagePage);
