import React from 'react';

import { AddressDomainFormContainer } from '../../../../components/AddressDomainFormContainer';
import AddressDomainCart from '../../../../components/AddressDomainCart';

import { AdditionalSelectedComponents } from '../AdditionalSelectedComponents';
import { DomainSelectionComponent } from '../DomainSelectionComponent';

import { QUERY_PARAMS_NAMES } from '../../../../constants/queryParams';

import { CartItem } from '../../../../types';
import { SelectedItemProps } from '../../../FioAddressSelectionPage/types';

type Props = {
  additionalItemsList: SelectedItemProps[];
  domainValue: string;
  error: string | null;
  loading: boolean;
  isDesktop: boolean;
  suggestedItem: SelectedItemProps;
  onClick: (selectedItem: CartItem) => void;
  onPeriodChange: (period: string, id: string) => void;
  setDomainValue: (domain: string) => void;
};

const FIELD_NAME = 'domain';

export const FioDomainSelectionComponent: React.FC<Props> = props => {
  const {
    additionalItemsList,
    domainValue,
    isDesktop,
    error,
    loading,
    suggestedItem,
    onClick,
    onPeriodChange,
    setDomainValue,
  } = props;
  return (
    <div>
      <AddressDomainFormContainer
        fieldName={FIELD_NAME}
        loading={loading}
        placeholder="Enter a Domain"
        queryParam={QUERY_PARAMS_NAMES.DOMAIN}
        setFieldValue={setDomainValue}
      />
      <DomainSelectionComponent
        domainValue={domainValue}
        isDesktop={isDesktop}
        error={error}
        loading={loading}
        suggestedItem={suggestedItem}
        onClick={onClick}
        onPeriodChange={onPeriodChange}
      />
      <AdditionalSelectedComponents
        domainValue={domainValue}
        error={error}
        isDesktop={isDesktop}
        additionalItemsList={additionalItemsList}
        loading={loading}
        onClick={onClick}
        onPeriodChange={onPeriodChange}
      />
      {!isDesktop && <AddressDomainCart />}
    </div>
  );
};
