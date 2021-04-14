import React from 'react';

import AddressFrom from '../../components/AddressForm';
import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';

import AddressDomainBadge, {
  ADDRESS_DOMAIN_BADGE_TYPE,
} from '../../components/AddressDomainBadge/AddressDomainBadge';
import { LINK_LABELS } from '../../constants/labels';
import { FORM_NAMES } from '../../constants/form';
import classes from './FioAddressPage.module.scss';

const FioAddressPage = props => {
  return (
    <LayoutContainer title={LINK_LABELS.FIO_ADDRESSES.toUpperCase()}>
      <div className={classes.container}>
        <div className={classes.cardContainer}>
          <AddressFrom formNameGet={FORM_NAMES.ADDRESS} />
          <AddressDomainBadge type={ADDRESS_DOMAIN_BADGE_TYPE.ADDRESS} />
        </div>
        <hr className={classes.vertical} />
        <div className={classes.cart}>CART</div>{' '}
        {/*todo: plug, replace with cart component */}
      </div>
    </LayoutContainer>
  );
};

export default FioAddressPage;
