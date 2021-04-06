import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { loading } from '../../redux/edge/selectors';

import { compose } from '../../utils';

import AddressForm from './AddressForm';

//todo: change to real data
const options = () => ['FIO', 'crypto', 'myDomainX', 'myDomainY'];
const prices = () => ({ address: 2.00, domain: 40.00 });

const reduxConnect = connect(
  createStructuredSelector({
    options,
    loading,
    prices,
  }),
  {}
);


export default compose(reduxConnect)(AddressForm);
