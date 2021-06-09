import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { loading, account, fioWallets } from '../../redux/edge/selectors';
import {
  loading as pricesLoading,
  prices,
  domains,
} from '../../redux/registrations/selectors';
import { getFormState } from '../../redux/forms/selectors';
import { updateFormState } from '../../redux/forms/actions';
import { refreshFioWallets } from '../../redux/edge/actions';
import { refreshFioNames } from '../../redux/fio/actions';
import { getPrices, getDomains } from '../../redux/registrations/actions';
import { cartItems } from '../../redux/cart/selectors';
import { fioDomains } from '../../redux/fio/selectors';
import { addItem, deleteItem, recalculate } from '../../redux/cart/actions';
import { hasFreeAddress } from '../../redux/profile/selectors';

import { compose } from '../../utils';

import AddressDomainForm from './AddressDomainForm';

const reduxConnect = connect(
  createStructuredSelector({
    account,
    loading,
    pricesLoading,
    prices,
    cartItems,
    domains,
    fioWallets,
    fioDomains,
    formState: (state, ownProps) => {
      const { isHomepage, formNameGet } = ownProps;
      return !isHomepage ? getFormState(state, formNameGet) : {};
    },
    hasFreeAddress,
  }),
  {
    getPrices,
    getDomains,
    refreshFioWallets,
    refreshFioNames,
    updateFormState,
    addItem,
    deleteItem,
    recalculate,
  },
);

export default compose(reduxConnect)(AddressDomainForm);
