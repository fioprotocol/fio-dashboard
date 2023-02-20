import React from 'react';
import classnames from 'classnames';

import classes from './FormHeader.module.scss';

type Props = {
  title: string;
  subtitle?: string | React.ReactNode;
  hasBigTopMargin?: boolean;
  header?: string | React.ReactElement;
  isSubNarrow?: boolean;
};

const FormHeader: React.FC<Props> = props => {
  const { hasBigTopMargin, header, isSubNarrow, title, subtitle } = props;

  return (
    <div
      className={classnames(
        !subtitle && 'mb-4' && 'mt-4',
        'd-flex flex-column text-white align-items-center justify-center',
        classes.container,
        hasBigTopMargin && classes.hasBigTopMargin,
      )}
    >
      {header && <div className={classes.header}>{header}</div>}
      <h4 className={classes.baseColored}>{title}</h4>
      {subtitle && (
        <div
          className={classnames(
            classes.subtitle,
            'text-center mb-4',
            isSubNarrow && 'w-75',
          )}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default FormHeader;
