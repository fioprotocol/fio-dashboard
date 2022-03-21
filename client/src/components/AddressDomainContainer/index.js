import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { cartItems } from '../../redux/cart/selectors';
import { hasFreeAddress } from '../../redux/profile/selectors';
import { allowCustomDomains } from '../../redux/registrations/selectors';

import { compose } from '../../utils';

import AddressDomainContainer from './AddressDomainContainer';

const reduxConnect = connect(
  createStructuredSelector({
    cartItems,
    hasFreeAddress,
    allowCustomDomains,
  }),
);

export default compose(reduxConnect)(AddressDomainContainer);
