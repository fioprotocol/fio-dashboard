import React from 'react';

import { SelectionItem } from '../../../../components/SelectionItem';
import Loader from '../../../../components/Loader/Loader';
import { DomainTypeBadge } from '../../../../components/SelectionItem/components/DomainTypeBadge';

import { SelectedItemProps } from '../../types';
import { CartItem } from '../../../../types';

import classes from './AdditionalItemsList.module.scss';

type Props = {
  isDesktop: boolean;
  list: SelectedItemProps[];
  loading: boolean;
  error?: string;
  onClick: (selectedItem: CartItem) => void;
};

export const AdditionalItemsList: React.FC<Props> = props => {
  const { isDesktop, error, list, loading, onClick } = props;

  if (error || !list.length) return null;

  if (loading)
    return (
      <>
        <h5 className={classes.subtitle}>Additional FIO Handles</h5>
        <Loader />
      </>
    );

  return (
    <div>
      <h5 className={classes.subtitle}>Additional FIO Handles</h5>
      {list.map(listItem => (
        <div className={classes.itemContainer} key={listItem.id}>
          <SelectionItem
            {...listItem}
            isDesktop={isDesktop}
            hasMaxWidth
            actionComponent={
              <DomainTypeBadge domainType={listItem.domainType} />
            }
            onClick={onClick}
          />
        </div>
      ))}
    </div>
  );
};
