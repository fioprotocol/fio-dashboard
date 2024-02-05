import React, { ReactNode } from 'react';

import classnames from 'classnames';

import classes from '../AddressWidget.module.scss';

type Props = {
  actionText: string | ReactNode | null;
  className?: string;
};

const ActionTextComponent: React.FC<Props> = props => {
  const { actionText, className } = props;

  if (!actionText) return null;

  return (
    <p className={classnames(classes.actionInfo, className)}>{actionText}</p>
  );
};

export default ActionTextComponent;
