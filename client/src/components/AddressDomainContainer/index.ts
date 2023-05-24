import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { cartItems } from '../../redux/cart/selectors';
import { hasFreeAddress } from '../../redux/profile/selectors';
import { isContainedFlow } from '../../redux/containedFlow/selectors';

import { compose } from '../../utils';

import AddressDomainContainer from './AddressDomainContainer';

const reduxConnect = connect(
  createStructuredSelector({
    cartItems,
    hasFreeAddress,
    isContainedFlow,
  }),
);

export default compose(reduxConnect)(AddressDomainContainer);
