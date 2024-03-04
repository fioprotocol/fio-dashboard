import React, { ReactNode } from 'react';

import classnames from 'classnames';

import classes from '../AddressWidget.module.scss';

type Props = {
  className?: string;
  subtitle: string | ReactNode | null;
};

const SubtitleComponent: React.FC<Props> = props => {
  const { className, subtitle } = props;
  return (
    <p className={classnames(classes.subtitle, className)}>
      {subtitle || 'and make your cryptocurrency payments easy'}
    </p>
  );
};

export default SubtitleComponent;
