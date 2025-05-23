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

  const [itemToExpiration, setItemToExpiration] = useState<{
    [id: string]: boolean | null;
  }>({});
  const [
    showExpiredDomainWarningBadge,
    toggleShowExpiredDomainWarningBadge,
  ] = useState<boolean>(false);
  const [listChanged, setListChanged] = useState<boolean>(false);

  const idListJson = JSON.stringify(list.map(({ id }) => id));
  const hasExpiredDomains = Object.values(itemToExpiration).some(
    isExpired => isExpired,
  );
  const itemsExpirationIsNotSet = Object.values(itemToExpiration).some(
    isExpired => isExpired === null,
  );

  const setDomainExpired = useCallback(
    ({ id, isExpired }: { id: string; isExpired: boolean | null }) => {
      setItemToExpiration(prevList => ({ ...prevList, [id]: isExpired }));
    },
    [],
  );

  const closeExpiredDomainNotification = useCallback(() => {
    toggleShowExpiredDomainWarningBadge(false);
  }, []);

  useEffect(() => {
    setItemToExpiration(
      JSON.parse(idListJson).reduce(
        (acc: { [id: string]: boolean | null }, id: string) => {
          acc[id] = null;
          return acc;
        },
        {},
      ),
    );
    setListChanged(true);
  }, [idListJson]);

  useEffect(() => {
    toggleShowExpiredDomainWarningBadge(hasExpiredDomains);
  }, [hasExpiredDomains]);
  useEffect(() => {
    // Retrigger the list render when the list is changed
    if (listChanged) {
      setListChanged(false);
    }
  }, [listChanged]);

  if (error || !list.length) return null;

  return (
    <>
      <div
        className={classnames(
          classes.container,
          loading || itemsExpirationIsNotSet ? null : classes.hidden,
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
          loading || itemsExpirationIsNotSet ? classes.hidden : null,
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
          {listChanged || loading
            ? null
            : list.map(listItem => (
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
