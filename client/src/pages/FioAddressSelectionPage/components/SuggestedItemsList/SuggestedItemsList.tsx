import React from 'react';

import { SelectionItem } from '../../../../components/SelectionItem';
import { ActionButton } from '../ActionButton';

import { SelectedItemProps } from '../../types';

import classes from './SuggestedItemsList.module.scss';

type Props = {
  isDesktop: boolean;
  list: SelectedItemProps[];
  error?: string;
  onClick: () => void;
};

export const SuggestedItemsList: React.FC<Props> = props => {
  const { isDesktop, error, list, onClick } = props;

  if (error) return null;

  return (
    <div className={classes.container}>
      {list.map(listItem => (
        <div className={classes.itemContainer}>
          <SelectionItem
            {...listItem}
            isSquareShape
            isDesktop={isDesktop}
            onClick={onClick}
          />
        </div>
      ))}
      <div className={classes.buttonContainer}>
        <ActionButton
          text="Add Custom Ending"
          hasSquareShape={!!list.length}
          onClick={onClick}
        />
      </div>
    </div>
  );
};
