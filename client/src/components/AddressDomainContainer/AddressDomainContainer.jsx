import React from 'react';
import AddressFrom from '../AddressDomainForm';
import LayoutContainer from '../LayoutContainer/LayoutContainer';
import AddressDomainBadge from '../AddressDomainBadge/AddressDomainBadge';
import AddressDomainCart from '../AddressDomainCart';
import { currentScreenType } from '../../screenType';
import { SCREEN_TYPE } from '../../constants/screen';
import classes from './AddressDomainContainer.module.scss';

const AddressDomainContainer = props => {
  const { title, type, formNameGet } = props;
  const { screenType } = currentScreenType();
  const isDesktop = screenType === SCREEN_TYPE.DESKTOP;
  return (
    <LayoutContainer title={title}>
      <div className={classes.container}>
        <div className={classes.cardContainer}>
          <AddressFrom formNameGet={formNameGet} type={type} />
          {!isDesktop && <AddressDomainCart />}
          <AddressDomainBadge type={type} />
        </div>
        <hr className={classes.vertical} />
        {isDesktop && <AddressDomainCart />}
      </div>
    </LayoutContainer>
  );
};

export default AddressDomainContainer;
