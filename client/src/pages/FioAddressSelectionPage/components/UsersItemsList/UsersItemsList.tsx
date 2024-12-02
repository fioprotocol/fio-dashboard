import React, { useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';

import Loader from '../../../../components/Loader/Loader';
import NotificationBadge from '../../../../components/NotificationBadge';
import { BADGE_TYPES } from '../../../../components/Badge/Badge';

import { UsersItem } from './UsersItem';
import { ActionButton } from '../ActionButton';

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

  const [usersItemsList, setUsersItemsList] = useState<{
    [id: string]: boolean | null;
  }>({});
  const [
    showExpiredDomainWarningBadge,
    toggleShowExpiredDomainWarningBadge,
  ] = useState<boolean>(false);

  const idListJson = JSON.stringify(list.map(({ id }) => id));
  const hasExpiredDomains = Object.values(usersItemsList).some(
    isExpired => isExpired,
  );
  const usersItemListLoading = Object.values(usersItemsList).some(
    isExpired => isExpired === null,
  );

  const setDomainExpired = useCallback(
    ({ id, isExpired }: { id: string; isExpired: boolean | null }) => {
      setUsersItemsList(prevList => ({ ...prevList, [id]: isExpired }));
    },
    [],
  );

  const closeExpiredDomainNotification = useCallback(() => {
    toggleShowExpiredDomainWarningBadge(false);
  }, []);

  useEffect(() => {
    setUsersItemsList(
      JSON.parse(idListJson).reduce(
        (acc: { [id: string]: boolean | null }, id: string) => {
          acc[id] = null;
          return acc;
        },
        {},
      ),
    );
  }, [idListJson]);

  useEffect(() => {
    toggleShowExpiredDomainWarningBadge(hasExpiredDomains);
  }, [hasExpiredDomains]);

  if (error || !list.length) return null;

  return (
    <>
      <div
        className={classnames(
          classes.container,
          loading || usersItemListLoading ? null : classes.hidden,
        )}
      >
        <h5 className={classes.subtitle}>My Domain FIO Handle</h5>
        <div className={classes.loaderContainer}>
          <Loader />
        </div>
      </div>
      <div
        className={classnames(
          classes.container,
          loading || usersItemListLoading ? classes.hidden : null,
        )}
      >
        <h5 className={classes.subtitle}>My Domain FIO Handle</h5>
        <NotificationBadge
          type={BADGE_TYPES.WARNING}
          title={WARNING_CONTENT.EXPIRED_DOMAINS.title}
          message={WARNING_CONTENT.EXPIRED_DOMAINS.message}
          show={showExpiredDomainWarningBadge}
          onClose={closeExpiredDomainNotification}
        />
        <div className={classes.listContainer}>
          {list.map(listItem => (
            <UsersItem
              key={listItem.id}
              listItem={listItem}
              isDesktop={isDesktop}
              setDomainExpired={setDomainExpired}
              onClick={onClick}
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
    </>
  );
};
