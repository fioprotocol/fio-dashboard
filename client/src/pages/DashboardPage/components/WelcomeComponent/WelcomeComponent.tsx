import React from 'react';
import classnames from 'classnames';

import { ItemWrapper } from '../ItemWrapper';
import { WelcomeComponentItem } from '../WelcomeComponentItem';

import { useContext } from './WelcomeComponentContext';

import { DefaultWelcomeComponentProps } from './types';

import classes from './WelcomeComponent.module.scss';

type Props = {
  onlyActions?: boolean;
  noPaddingTop?: boolean;
} & DefaultWelcomeComponentProps;

export const WelcomeComponent: React.FC<Props> = props => {
  const { onlyActions = false, noPaddingTop = false } = props;
  const {
    text,
    title,
    firstWelcomeItem,
    secondWelcomeItem,
    loading,
  } = useContext(props);

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
