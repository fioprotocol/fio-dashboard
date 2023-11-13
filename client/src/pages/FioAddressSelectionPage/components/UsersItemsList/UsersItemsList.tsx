import React, { useCallback, useEffect, useState } from 'react';

import { SelectionItem } from '../../../../components/SelectionItem';
import Loader from '../../../../components/Loader/Loader';
import { DomainTypeBadge } from '../../../../components/SelectionItem/components/DomainTypeBadge';
import NotificationBadge from '../../../../components/NotificationBadge';
import { BADGE_TYPES } from '../../../../components/Badge/Badge';

import { ActionButton } from '../ActionButton';

import { isDomainExpired } from '../../../../util/fio';
import apis from '../../../../api';
import { log } from '../../../../util/general';

import { WARNING_CONTENT } from '../../../FioAddressManagePage/constants';

import { SelectedItemProps } from '../../types';
import { CartItem } from '../../../../types';

import classes from './UsersItemsList.module.scss';

type Props = {
  addressValue: string;
  loading: boolean;
  isDesktop: boolean;
  list: SelectedItemProps[];
  error?: string;
  onClick: (selectedItem: CartItem) => void;
};

export const UsersItemsList: React.FC<Props> = props => {
  const { addressValue, isDesktop, error, list, loading, onClick } = props;

  const [usersItemsList, setUsersItemsList] = useState<SelectedItemProps[]>([]);
  const [usersItemListLoading, toggleUsersItemsListLoading] = useState<boolean>(
    false,
  );
  const [
    showExpiredDomainWarningBadge,
    toggleShowExpiredDomainWarningBadge,
  ] = useState<boolean>(false);

  const hasExpiredDomains = usersItemsList.some(
    usersItem => usersItem.isExpired,
  );

  const closeExpiredDomainNotification = useCallback(() => {
    toggleShowExpiredDomainWarningBadge(false);
  }, []);

  const getDomainExpiration = useCallback(async (domainName: string) => {
    try {
      const { expiration } = (await apis.fio.getFioDomain(domainName)) || {};

      return expiration || null;
    } catch (err) {
      log.error(err);
    }
  }, []);

  const checkIsDomainExpired = useCallback(
    async (domainName: string) => {
      if (!domainName) return null;

      const expiration = await getDomainExpiration(domainName);

      return expiration && isDomainExpired(domainName, expiration);
    },
    [getDomainExpiration],
  );

  const handleExpiredDomains = useCallback(async () => {
    toggleUsersItemsListLoading(true);
    const usersItemListWithExpiredDomainCheck = [];
    for (const listItem of list) {
      const isExpired = await checkIsDomainExpired(listItem.domain);
      usersItemListWithExpiredDomainCheck.push({
        ...listItem,
        isExpired,
      });
    }

    setUsersItemsList(usersItemListWithExpiredDomainCheck);
    toggleUsersItemsListLoading(false);
  }, [checkIsDomainExpired, list]);

  useEffect(() => {
    handleExpiredDomains();
  }, [handleExpiredDomains]);

  useEffect(() => {
    toggleShowExpiredDomainWarningBadge(hasExpiredDomains);
  }, [hasExpiredDomains]);

  if (error || !list.length) return null;

  if (loading || usersItemListLoading)
    return (
      <div className={classes.container}>
        <h5 className={classes.subtitle}>My Domain FIO Handle</h5>
        <div className={classes.loaderContainer}>
          <Loader />
        </div>
      </div>
    );

  return (
    <div className={classes.container}>
      <h5 className={classes.subtitle}>My Domain FIO Handle</h5>
      <NotificationBadge
        type={BADGE_TYPES.WARNING}
        title={WARNING_CONTENT.EXPIRED_DOMAINS.title}
        message={WARNING_CONTENT.EXPIRED_DOMAINS.message}
        show={showExpiredDomainWarningBadge}
        onClose={closeExpiredDomainNotification}
      />
      <div className={classes.listContainer}>
        {usersItemsList.map(listItem => (
          <SelectionItem
            {...listItem}
            disabled={listItem.isExpired}
            isSquareShape
            isDesktop={isDesktop}
            actionComponent={
              <DomainTypeBadge
                domainType={listItem.domainType}
                disabled={listItem.isExpired}
              />
            }
            onClick={onClick}
            key={listItem.id}
          />
        ))}
        <div className={classes.buttonContainer}>
          <ActionButton
            text="View More"
            hasSquareShape
            addressValue={addressValue}
            shouldPrependUserDomains
          />
        </div>
      </div>
    </div>
  );
};
