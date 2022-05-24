import React, { ReactNode } from 'react';

import classes from '../AddressWidget.module.scss';

type Props = {
  actionText: string | ReactNode | null;
};

const ActionTextComponent: React.FC<Props> = props => {
  const { actionText } = props;

  if (!actionText) return null;

  return <p className={classes.actionInfo}>{actionText}</p>;
};

export default ActionTextComponent;
