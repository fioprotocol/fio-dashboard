import React from 'react';
import classnames from 'classnames';

import { ItemWrapper } from '../ItemWrapper';
import { WelcomeComponentItem } from '../WelcomeComponentItem';

import { useContext } from './WelcomeComponentContext';

import { WelcomeItemProps } from '../WelcomeComponentItem/constants';

import classes from './WelcomeComponent.module.scss';

type Props = {
  firstWelcomeItem: WelcomeItemProps | null;
  secondWelcomeItem: WelcomeItemProps | null;
  loading: boolean;
  onlyActions?: boolean;
  noPaddingTop?: boolean;
};

export const WelcomeComponent: React.FC<Props> = props => {
  const {
    firstWelcomeItem,
    secondWelcomeItem,
    loading,
    onlyActions = false,
    noPaddingTop = false,
  } = props;
  const { text, title } = useContext();

  return (
    <ItemWrapper hasFullWidth hasMarginTop={onlyActions}>
      <div
        className={classnames(
          classes.container,
          noPaddingTop && classes.noPaddingTop,
        )}
      >
        {!onlyActions && <h2 className={classes.title}>{title}</h2>}
        {!onlyActions && <p className={classes.text}>{text}</p>}
        <div className={classes.actionItemContainer}>
          <WelcomeComponentItem content={firstWelcomeItem} loading={loading} />
          <WelcomeComponentItem content={secondWelcomeItem} loading={loading} />
        </div>
      </div>
    </ItemWrapper>
  );
};
