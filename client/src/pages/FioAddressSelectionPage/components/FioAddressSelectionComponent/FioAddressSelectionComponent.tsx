import React from 'react';

import AddressDomainCart from '../../../../components/AddressDomainCart';
import InfoBadge from '../../../../components/InfoBadge/InfoBadge';

import { AddressFormContainer } from '../AddressFormContainer';

import { BADGE_TYPES } from '../../../../components/Badge/Badge';

import { useContext } from './FioAddressSelectionComponentContext';

import classes from './FioAddressSelectionComponent.module.scss';

type Props = {
  isDesktop: boolean;
};

export const FioAddressSelectionComponent: React.FC<Props> = props => {
  const { isDesktop } = props;
  const { addressValue, error, loading, setAddressValue } = useContext();

  return (
    <div>
      <AddressFormContainer
        loading={loading}
        setAddressValue={setAddressValue}
      />
      <h5 className={classes.subtitle}>Suggested FIO Crypto Handles</h5>
      <div className={classes.infoBadgeContainer}>
        <InfoBadge
          show={!addressValue}
          type={BADGE_TYPES.INFO}
          title="Enter Username"
          message="Please enter a username in order to register a FIO Crypto Handle."
        />
      </div>
      <div className={classes.infoBadgeContainer}>
        <InfoBadge
          title="Try again!"
          message={error}
          show={!!error}
          type={BADGE_TYPES.ERROR}
        />
      </div>
      {!isDesktop && <AddressDomainCart />}
    </div>
  );
};
