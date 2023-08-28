import React from 'react';

import { SelectionItem } from '../../../../components/SelectionItem';
import Loader from '../../../../components/Loader/Loader';
import { DomainTypeBadge } from '../../../../components/SelectionItem/components/DomainTypeBadge';

import { ActionButton } from '../ActionButton';

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

  if (error || !list.length) return null;

  if (loading)
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
      <div className={classes.listContainer}>
        {list.map(listItem => (
          <SelectionItem
            {...listItem}
            isSquareShape
            isDesktop={isDesktop}
            actionComponent={
              <DomainTypeBadge domainType={listItem.domainType} />
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
