import React from 'react';
import AddressFrom from '../../components/AddressDomainForm';
import LayoutContainer from '../../components/LayoutContainer/LayoutContainer';

import AddressDomainBadge from '../../components/AddressDomainBadge/AddressDomainBadge';
import classes from './AddressDomainContainer.module.scss';

const AddressDomainContainer = props => {
  const { title, type, formNameGet } = props;
  return (
    <LayoutContainer title={title}>
      <div className={classes.container}>
        <div className={classes.cardContainer}>
          <AddressFrom formNameGet={formNameGet} type={type} />
          <AddressDomainBadge type={type} />
        </div>
        <hr className={classes.vertical} />
        <div className={classes.cart}>CART</div>{' '}
        {/*todo: plug, replace with cart component */}
      </div>
    </LayoutContainer>
  );
};

export default AddressDomainContainer;
