import React from 'react';

import { SelectionItem } from '../../../../components/SelectionItem';

import { SelectedItemProps } from '../../types';

import classes from './AdditionalItemsList.module.scss';

type Props = {
  isDesktop: boolean;
  list: SelectedItemProps[];
  error?: string;
  onClick: () => void;
};

export const AdditionalItemsList: React.FC<Props> = props => {
  const { isDesktop, error, list, onClick } = props;

  if (error || !list.length) return null;

  return (
    <div>
      <h5 className={classes.subtitle}>Additional FIO Crypto Handles</h5>
      {list.map(listItem => (
        <div className={classes.itemContainer} key={listItem.id}>
          <SelectionItem
            {...listItem}
            isDesktop={isDesktop}
            onClick={onClick}
          />
        </div>
      ))}
    </div>
  );
};
