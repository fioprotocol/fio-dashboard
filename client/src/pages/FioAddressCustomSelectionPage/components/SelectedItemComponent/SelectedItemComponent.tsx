import React from 'react';

import InfoBadge from '../../../../components/InfoBadge/InfoBadge';
import { SelectionItem } from '../../../../components/SelectionItem';
import { DomainTypeBadge } from '../../../../components/SelectionItem/components/DomainTypeBadge';

import { BADGE_TYPES } from '../../../../components/Badge/Badge';

import { useContext } from './SelectedItemComponentContext';

import { AllDomains, CartItem } from '../../../../types';

export type SelectedItemComponentProps = {
  allDomains: AllDomains;
  address: string;
  domain: string;
  show: boolean;
  isDesktop: boolean;
  onClick: (selectedItem: CartItem) => void;
};

export const SelectedItemComponent: React.FC<SelectedItemComponentProps> = props => {
  const { isDesktop, show, onClick } = props;

  const { selectedItemProps, showPremiumInfoBadge } = useContext(props);

  if (!show) return null;

  return (
    <div>
      <SelectionItem
        {...selectedItemProps}
        isDesktop={isDesktop}
        onClick={onClick}
        hasShortNamePart
        hasWhiteBackground
        hasMaxWidth
        actionComponent={
          <DomainTypeBadge domainType={selectedItemProps.domainType} />
        }
      />
      <InfoBadge
        title="Premium"
        message="The domain for this FIO Handle is already registered but you are still able to register one as a premium FIO Handle."
        show={showPremiumInfoBadge}
        type={BADGE_TYPES.INFO}
      />
    </div>
  );
};
