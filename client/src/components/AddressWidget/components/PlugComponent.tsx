import React from 'react';

import classes from '../AddressWidget.module.scss';

type Props = {
  show: boolean;
};

const PlugComponent: React.FC<Props> = props => {
  const { show } = props;

  if (!show) return null;

  return <div className={classes.bottom} />;
};

export default PlugComponent;
