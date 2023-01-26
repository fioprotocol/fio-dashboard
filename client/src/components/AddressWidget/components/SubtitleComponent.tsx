import React, { ReactNode } from 'react';

import classes from '../AddressWidget.module.scss';

type Props = {
  subtitle: string | ReactNode | null;
};

const SubtitleComponent: React.FC<Props> = props => {
  const { subtitle } = props;
  return (
    <p className={classes.subtitle}>
      {subtitle || 'and make your cryptocurrency payments easy'}
    </p>
  );
};

export default SubtitleComponent;
