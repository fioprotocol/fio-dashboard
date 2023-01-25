import React from 'react';

import { SelectionItem } from '../../../../components/SelectionItem';
import { DomainPeriodDropdown } from '../../../../components/SelectionItem/components/DomainPeriodDropdown';
import Loader from '../../../../components/Loader/Loader';

import { DOMAIN_ALREADY_EXISTS } from '../../../../constants/errors';

import { CartItem } from '../../../../types';
import { SelectedItemProps } from '../../../FioAddressSelectionPage/types';

import classes from './AdditionalSelectedComponents.module.scss';

type Props = {
  additionalItemsList: SelectedItemProps[];
  domainValue: string;
  error: string | null;
  isDesktop: boolean;
  loading: boolean;
  onClick: (selectedItem: CartItem) => void;
  onPeriodChange: (period: string, id: string) => void;
};

export const AdditionalSelectedComponents: React.FC<Props> = props => {
  const {
    additionalItemsList,
    error,
    isDesktop,
    domainValue,
    loading,
    onClick,
    onPeriodChange,
  } = props;

  if (
    !domainValue ||
    !additionalItemsList.length ||
    (error && error !== DOMAIN_ALREADY_EXISTS)
  )
    return null;

  return (
    <div className={classes.container}>
      <h5 className={classes.subtitle}>Additional FIO Domains</h5>
      {loading && <Loader />}
      <div>
        {additionalItemsList.map(additionalItem => (
          <div key={additionalItem.id} className={classes.itemContainer}>
            <SelectionItem
              isDesktop={isDesktop}
              {...additionalItem}
              actionComponent={
                <DomainPeriodDropdown
                  id={additionalItem.id}
                  period={additionalItem.period}
                  onPeriodChange={onPeriodChange}
                />
              }
              onClick={onClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
