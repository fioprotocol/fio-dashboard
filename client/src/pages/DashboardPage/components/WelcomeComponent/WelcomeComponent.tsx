import React from 'react';

import { ItemWrapper } from '../ItemWrapper';
import { WelcomeComponentItem } from '../WelcomeComponentItem';

import { useContext } from './WelcomeComponentContext';

import { WelcomeItemProps } from '../WelcomeComponentItem/constants';

import classes from './WelcomeComponent.module.scss';

type Props = {
  firstWelcomeItem: WelcomeItemProps | null;
  secondWelcomeItem: WelcomeItemProps | null;
};

export const WelcomeComponent: React.FC<Props> = props => {
  const { firstWelcomeItem, secondWelcomeItem } = props;
  const { text, title } = useContext();

  return (
    <ItemWrapper>
      <div className={classes.container}>
        <h2 className={classes.title}>{title}</h2>
        <p className={classes.text}>{text}</p>
        <div className={classes.actionItemContainer}>
          <WelcomeComponentItem {...firstWelcomeItem} />
          {secondWelcomeItem && <WelcomeComponentItem {...secondWelcomeItem} />}
        </div>
      </div>
    </ItemWrapper>
  );
};
