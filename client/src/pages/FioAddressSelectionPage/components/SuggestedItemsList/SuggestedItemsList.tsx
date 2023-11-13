import React from 'react';

import { SelectionItem } from '../../../../components/SelectionItem';
import Loader from '../../../../components/Loader/Loader';
import { DomainTypeBadge } from '../../../../components/SelectionItem/components/DomainTypeBadge';

import { ActionButton } from '../ActionButton';

import { FIO_ADDRESS_ALREADY_EXISTS } from '../../../../constants/errors';

import { SelectedItemProps } from '../../types';
import { CartItem } from '../../../../types';

import classes from './SuggestedItemsList.module.scss';

type Props = {
  addressValue: string;
  loading: boolean;
  isDesktop: boolean;
  list: SelectedItemProps[];
  error?: string;
  hideActionButton?: boolean;
  onClick: (selectedItem: CartItem) => void;
};

export const SuggestedItemsList: React.FC<Props> = props => {
  const {
    addressValue,
    isDesktop,
    error,
    list,
    loading,
    hideActionButton,
    onClick,
  } = props;

  if ((error && error !== FIO_ADDRESS_ALREADY_EXISTS) || !addressValue)
    return null;

  if (loading)
    return (
      <div className={classes.loaderContainer}>
        <Loader />
      </div>
    );

  return (
    <div className={classes.container}>
      {!error &&
        list.map(listItem => (
          <SelectionItem
            {...listItem}
            isSquareShape
            isDesktop={isDesktop}
            actionComponent={
              <DomainTypeBadge
                domainType={listItem.domainType}
                isFree={listItem.isFree}
                hasCustomDomainInCart={listItem.hasCustomDomainInCart}
              />
            }
            onClick={onClick}
            key={listItem.id}
          />
        ))}
      <div className={classes.buttonContainer}>
        <ActionButton
          text="Add Custom Ending"
          hasSquareShape={!!list.length}
          addressValue={addressValue}
          hide={hideActionButton}
        />
      </div>
    </div>
  );
};
