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

import { compose } from '../../utils';

import AddressDomainForm from './AddressDomainForm';

//todo: change to real data
/*****/
const fioAmount = () => 55.0123;
const cart = () => ({ items: ['1', '2'] });
/*****/

const reduxConnect = connect(
  createStructuredSelector({
    account,
    loading,
    pricesLoading,
    prices,
    fioAmount,
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
  },
);

export default compose(reduxConnect)(AddressDomainForm);
