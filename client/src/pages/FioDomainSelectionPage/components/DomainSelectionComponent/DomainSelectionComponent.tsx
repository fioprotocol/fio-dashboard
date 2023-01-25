import React from 'react';

import InfoBadge from '../../../../components/InfoBadge/InfoBadge';
import { SelectionItem } from '../../../../components/SelectionItem';
import { DomainPeriodDropdown } from '../../../../components/SelectionItem/components/DomainPeriodDropdown';
import Loader from '../../../../components/Loader/Loader';

import { BADGE_TYPES } from '../../../../components/Badge/Badge';

import { CartItem } from '../../../../types';
import { SelectedItemProps } from '../../../FioAddressSelectionPage/types';

import classes from './DomainSelectionComponent.module.scss';

type Props = {
  domainValue: string;
  error: string | null;
  isDesktop: boolean;
  loading: boolean;
  suggestedItem: SelectedItemProps;
  onClick: (selectedItem: CartItem) => void;
  onPeriodChange: (period: string, id: string) => void;
};

export const DomainSelectionComponent: React.FC<Props> = props => {
  const {
    domainValue,
    error,
    isDesktop,
    loading,
    suggestedItem,
    onClick,
    onPeriodChange,
  } = props;

  if (!domainValue || !suggestedItem) return null;

  if (error)
    return (
      <div>
        <h5 className={classes.subtitle}>Suggested FIO Domains</h5>
        <div className={classes.infoBadgeContainer}>
          <InfoBadge
            title="Try again!"
            message={error}
            show={!!error}
            type={BADGE_TYPES.ERROR}
          />
        </div>
      </div>
    );

  if (loading)
    return (
      <>
        <h5 className={classes.subtitle}>Suggested FIO Domains</h5>
        <Loader />
      </>
    );

  return (
    <div>
      <h5 className={classes.subtitle}>Suggested FIO Domains</h5>
      <SelectionItem
        isDesktop={isDesktop}
        {...suggestedItem}
        actionComponent={
          <DomainPeriodDropdown
            id={suggestedItem.id}
            period={suggestedItem?.period}
            onPeriodChange={onPeriodChange}
          />
        }
        onClick={onClick}
      />
    </div>
  );
};
