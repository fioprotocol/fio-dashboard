import React, { useCallback, useEffect, useState } from 'react';

import { SelectionItem } from '../../../../components/SelectionItem';
import { DomainTypeBadge } from '../../../../components/SelectionItem/components/DomainTypeBadge';

import { checkIsDomainExpired } from '../../../../util/fio';

import { SelectedItemProps } from '../../types';
import { CartItem } from '../../../../types';

type Props = {
  isDesktop: boolean;
  listItem: SelectedItemProps;
  setDomainExpired: (item: { id: string; isExpired: boolean | null }) => void;
  onClick: (selectedItem: CartItem) => void;
};

export const UsersItem: React.FC<Props> = props => {
  const { listItem, isDesktop, setDomainExpired, onClick } = props;

  const [isExpired, setIsExpired] = useState<boolean>(false);

  const handleExpiredDomain = useCallback(
    ({ id, isExpired }: { id: string; isExpired: boolean | null }) => {
      setDomainExpired({ id, isExpired });
      setIsExpired(!!isExpired);
    },
    [setDomainExpired],
  );

  const checkDomain = useCallback(async () => {
    handleExpiredDomain({ id: listItem.id, isExpired: null });
    const isExpired = await checkIsDomainExpired(listItem.domain);
    handleExpiredDomain({ id: listItem.id, isExpired });
  }, [listItem.id, listItem.domain, handleExpiredDomain]);

  useEffect(() => {
    checkDomain();
  }, [checkDomain]);

  return (
    <SelectionItem
      {...listItem}
      disabled={isExpired}
      isSquareShape
      isDesktop={isDesktop}
      actionComponent={
        <DomainTypeBadge
          domainType={listItem.domainType}
          disabled={isExpired}
        />
      }
      onClick={onClick}
    />
  );
};
