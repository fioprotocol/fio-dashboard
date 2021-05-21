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
import { getPrices, getDomains } from '../../redux/registrations/actions';
import { cart } from '../../redux/cart/selectors';
import { addItem, deleteItem } from '../../redux/cart/actions';

import { compose } from '../../utils';

import AddressDomainForm from './AddressDomainForm';

const reduxConnect = connect(
  createStructuredSelector({
    account,
    loading,
    pricesLoading,
    prices,
    cart,
    domains,
    fioWallets,
    formState: (state, ownProps) => {
      const { isHomepage, formNameGet } = ownProps;
      return !isHomepage ? getFormState(state, formNameGet) : {};
    },
  }),
  {
    getPrices,
    getDomains,
    refreshFioWallets,
    updateFormState,
    addItem,
    deleteItem,
  },
);

export default compose(reduxConnect)(AddressDomainForm);
