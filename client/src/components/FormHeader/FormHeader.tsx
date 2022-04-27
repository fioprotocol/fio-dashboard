import React from 'react';
import classnames from 'classnames';

import classes from './FormHeader.module.scss';

type Props = {
  title: string;
  titleBluePart?: string;
  subtitle: string | React.ReactNode;
  isDoubleColor?: boolean;
  header?: string | React.ReactElement;
  isSubNarrow?: boolean;
};

const FormHeader: React.FC<Props> = props => {
  const {
    title,
    titleBluePart = '',
    subtitle,
    isDoubleColor,
    header,
    isSubNarrow,
  } = props;

  const firstWord = isDoubleColor && `${title}`.split(' ')[0];
  return (
    <div
      className={classnames(
        !subtitle && 'mb-4' && 'mt-4',
        'd-flex flex-column text-white align-items-center justify-center',
      )}
    >
      {header && <div className={classes.header}>{header}</div>}
      <h4
        className={classnames(
          isDoubleColor && classes.colored,
          classes.baseColored,
        )}
        data-highlightword={isDoubleColor && firstWord}
      >
        {title}
        <span className={classnames(classes.baseColored, classes.colored)}>
          {' '}
          {titleBluePart}
        </span>
      </h4>
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
