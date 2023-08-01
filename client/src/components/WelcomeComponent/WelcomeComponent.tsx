import React from 'react';
import classnames from 'classnames';

import { WelcomeComponentItem } from './components/WelcomeComponentItem';

import { useContext } from './WelcomeComponentContext';

import { DefaultWelcomeComponentProps } from './types';

import classes from './WelcomeComponent.module.scss';

type Props = {
  onlyActions?: boolean;
  noPaddingTop?: boolean;
  withoutMarginTop?: boolean;
} & DefaultWelcomeComponentProps;

export const WelcomeComponent: React.FC<Props> = props => {
  const { onlyActions = false, noPaddingTop = false, withoutMarginTop } = props;
  const {
    text,
    title,
    firstWelcomeItem,
    secondWelcomeItem,
    loading,
  } = useContext(props);

  return (
    <div
      className={classnames(
        classes.container,
        withoutMarginTop && classes.withoutMarginTop,
      )}
    >
      <div
        className={classnames(
          classes.contentContainer,
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
    </div>
  );
};
