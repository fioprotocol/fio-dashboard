import React from 'react';

import AddressDomainCart from '../../../../components/AddressDomainCart';
import InfoBadge from '../../../../components/InfoBadge/InfoBadge';
import { AddressDomainFormContainer } from '../../../../components/AddressDomainFormContainer';

import { SuggestedItemsList } from '../SuggestedItemsList';
import { UsersItemsList } from '../UsersItemsList';
import { AdditionalItemsList } from '../AdditionalItemsList';

import { BADGE_TYPES } from '../../../../components/Badge/Badge';

import { QUERY_PARAMS_NAMES } from '../../../../constants/queryParams';

import { UseContextProps } from '../../types';

import classes from './FioAddressSelectionComponent.module.scss';

type Props = {
  isDesktop: boolean;
} & UseContextProps;

const FIELD_NAME = 'address';

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
    <>
      <div className={classes.container}>
        <AddressDomainFormContainer
          fieldName={FIELD_NAME}
          loading={loading}
          placeholder="Enter a Username"
          queryParam={QUERY_PARAMS_NAMES.ADDRESS}
          setFieldValue={setAddressValue}
        />
        <UsersItemsList
          addressValue={addressValue}
          list={usersItemsList}
          error={error}
          isDesktop={isDesktop}
          onClick={onClick}
          loading={loading}
        />
        <h5 className={classes.subtitle}>Suggested FIO Handles</h5>
        <div className={classes.infoBadgeContainer}>
          <InfoBadge
            title="Try again!"
            message={error}
            show={!!error}
            type={BADGE_TYPES.ERROR}
          />
        </div>
        <SuggestedItemsList
          list={suggestedItemsList}
          loading={loading}
          error={error}
          isDesktop={isDesktop}
          addressValue={addressValue}
          onClick={onClick}
        />
        <div className={classes.infoBadgeContainer}>
          <InfoBadge
            show={!addressValue}
            type={BADGE_TYPES.INFO}
            title="Enter Username"
            message="Please enter a username in order to register a FIO Handle."
          />
        </div>
        <AdditionalItemsList
          list={additionalItemsList}
          loading={loading}
          error={error}
          isDesktop={isDesktop}
          onClick={onClick}
        />
      </div>
      {!isDesktop && <AddressDomainCart />}
    </>
  );
};
