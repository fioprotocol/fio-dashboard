import React from 'react';

import { ItemWrapper } from '../ItemWrapper';
import { WelcomeComponentItem } from '../WelcomeComponentItem';

import { useContext } from './WelcomeComponentContext';

import { WelcomeItemProps } from '../WelcomeComponentItem/constants';

import classes from './WelcomeComponent.module.scss';

type Props = {
  firstWelcomeItem: WelcomeItemProps | null;
  secondWelcomeItem: WelcomeItemProps | null;
  loading: boolean;
};

export const WelcomeComponent: React.FC<Props> = props => {
  const { firstWelcomeItem, secondWelcomeItem, loading } = props;
  const { text, title } = useContext();

  return (
    <ItemWrapper hasFullWidth>
      <div className={classes.container}>
        <h2 className={classes.title}>{title}</h2>
        <p className={classes.text}>{text}</p>
        <div className={classes.actionItemContainer}>
          <WelcomeComponentItem content={firstWelcomeItem} loading={loading} />
          <WelcomeComponentItem content={secondWelcomeItem} loading={loading} />
        </div>
      </div>
    </ItemWrapper>
  );
};
