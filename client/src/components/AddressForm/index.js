import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { loading } from '../../redux/edge/selectors';
import { getFormState } from '../../redux/forms/selectors';
import { updateFormState } from '../../redux/forms/actions';

import { compose } from '../../utils';

import AddressForm from './AddressForm';

//todo: change to real data
/*****/
const options = () => ['fio', 'crypto'];
const prices = () => ({ address: 2.00, domain: 40.00 });
const fioAmount = () => 55.0123;
const cart = () => ({items: ['1', '2']});
/*****/

const reduxConnect = connect(
  createStructuredSelector({
    options,
    loading,
    prices,
    fioAmount,
    cart,
    formState: (state, ownProps) => {
      const { isHomepage, formNameGet } = ownProps;
      return !isHomepage ? getFormState(state, formNameGet) : {};
    },
  }),
  { updateFormState }
);


export default compose(reduxConnect)(AddressForm);
