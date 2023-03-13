import React from 'react';

import { ItemWrapper } from '../ItemWrapper';

import { useContext } from './WelcomeComponentContext';

import classes from './WelcomeComponent.module.scss';

type Props = {};

export const WelcomeComponent: React.FC<Props> = props => {
  const { firstWelcomeItem, secondWelcomeItem, text, title } = useContext();

  return (
    <ItemWrapper>
      <div className={classes.container}>
        <h2 className={classes.title}>{title}</h2>
        <p className={classes.text}>{text}</p>
        <div className={classes.actionItemContainer}>
          {firstWelcomeItem}
          {secondWelcomeItem}
        </div>
      </div>
    </ItemWrapper>
  );
};
