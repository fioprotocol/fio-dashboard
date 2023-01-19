import React from 'react';

import { SelectionItem } from '../../../../components/SelectionItem';
import { ActionButton } from '../ActionButton';

import { SelectedItemProps } from '../../types';

import classes from './UsersItemsList.module.scss';

type Props = {
  isDesktop: boolean;
  list: SelectedItemProps[];
  error?: string;
  onClick: () => void;
};

export const UsersItemsList: React.FC<Props> = props => {
  const { isDesktop, error, list, onClick } = props;

  if (error || !list.length) return null;

  return (
    <div>
      <h5 className={classes.subtitle}>My Domain FIO Crypto Handle</h5>
      <div className={classes.listContainer}>
        {list.map(listItem => (
          <SelectionItem
            {...listItem}
            isSquareShape
            isDesktop={isDesktop}
            onClick={onClick}
            key={listItem.id}
          />
        ))}
        <div className={classes.buttonContainer}>
          <ActionButton text="View More" hasSquareShape onClick={onClick} />
        </div>
      </div>
    </div>
  );
};
