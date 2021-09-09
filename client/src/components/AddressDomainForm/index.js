import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { updateFormState } from '../../redux/forms/actions';
import { refreshFioNames } from '../../redux/fio/actions';
import { addItem, deleteItem, recalculate } from '../../redux/cart/actions';
import { getPrices, getDomains } from '../../redux/registrations/actions';
import { cartItems } from '../../redux/cart/selectors';
import { getFormState } from '../../redux/forms/selectors';
import { fioDomains, fioWallets } from '../../redux/fio/selectors';
import { hasFreeAddress } from '../../redux/profile/selectors';
import {
  loading as pricesLoading,
  prices,
  domains,
  allowCustomDomains,
} from '../../redux/registrations/selectors';

import { compose } from '../../utils';

import AddressDomainForm from './AddressDomainForm';

const reduxConnect = connect(
  createStructuredSelector({
    pricesLoading,
    prices,
    cartItems,
    domains: state => {
      const publicDomains = domains(state);
      const userDomains = fioDomains(state);
      return [
        ...publicDomains,
        ...userDomains.map(({ name }) => ({ domain: name })),
      ];
    },
    fioWallets,
    formState: (state, ownProps) => {
      const { isHomepage, formNameGet } = ownProps;
      return !isHomepage ? getFormState(state, formNameGet) : {};
    },
    hasFreeAddress,
    allowCustomDomains,
  }),
  {
    getPrices,
    getDomains,
    refreshFioNames,
    updateFormState,
    addItem,
    deleteItem,
    recalculate,
  },
);

export default compose(reduxConnect)(AddressDomainForm);
