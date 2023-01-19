import React from 'react';

import AddressDomainCart from '../../../../components/AddressDomainCart';
import InfoBadge from '../../../../components/InfoBadge/InfoBadge';

import { SuggestedItemsList } from '../SuggestedItemsList';
import { UsersItemsList } from '../UsersItemsList';
import { AdditionalItemsList } from '../AdditionalItemsList';
import { AddressFormContainer } from '../AddressFormContainer';

import { BADGE_TYPES } from '../../../../components/Badge/Badge';

import { UseContextProps } from '../../types';

import classes from './FioAddressSelectionComponent.module.scss';

type Props = {
  isDesktop: boolean;
} & UseContextProps;

export const FioAddressSelectionComponent: React.FC<Props> = props => {
  const {
    additionalItemsList,
    addressValue,
    error,
    isDesktop,
    loading,
    suggestedItemsList,
    usersItemsList,
    onClick,
    setAddressValue,
  } = props;

  return (
    <div>
      <AddressFormContainer
        loading={loading}
        setAddressValue={setAddressValue}
      />
      <UsersItemsList
        list={usersItemsList}
        error={error}
        isDesktop={isDesktop}
        onClick={onClick}
      />
      <h5 className={classes.subtitle}>Suggested FIO Crypto Handles</h5>
      <SuggestedItemsList
        list={suggestedItemsList}
        error={error}
        isDesktop={isDesktop}
        onClick={onClick}
      />
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
      <AdditionalItemsList
        list={additionalItemsList}
        error={error}
        isDesktop={isDesktop}
        onClick={onClick}
      />
      {!isDesktop && <AddressDomainCart />}
    </div>
  );
};
