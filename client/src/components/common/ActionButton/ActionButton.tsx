import React, { ReactNode } from 'react';

import classnames from 'classnames';

import { useCheckIfSmallDesktop } from '../../../screenType';

import SubmitButton from '../SubmitButton/SubmitButton';

import classes from './ActionButton.module.scss';

type Props = {
  className?: string;
  icon?: ReactNode;
  title?: string;
  largeScreenTitle?: string;
  onClick?: () => void;
};

export const ActionButton: React.FC<Props> = props => {
  const { className, icon, title, largeScreenTitle, onClick } = props;

  const isSmallDesktop = useCheckIfSmallDesktop();

  return (
    <SubmitButton
      hasAutoWidth
      withoutMargin
      hasNoSidePaddings
      className={classnames(classes.button, className)}
      title={title}
      onClick={onClick}
      text={
        <>
          {icon}
          {!isSmallDesktop && largeScreenTitle && largeScreenTitle}
        </>
      }
    />
  );
};
