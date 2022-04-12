import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';

import InfoBadge from '../InfoBadge/InfoBadge';

import { BADGE_TYPES } from '../Badge/Badge';

import classes from './Input.module.scss';

import { AnyType } from '../../types';

export const ERROR_UI_TYPE = {
  TEXT: 'TEXT',
  BADGE: 'BADGE',
};

export const COLOR_TYPE = {
  WHITE: 'white',
  WARN: 'warn',
};

type Props = {
  error?: string | null;
  hasError: boolean;
  data?: { [key: string]: AnyType };
  submitError?: boolean;
  useVisibility?: boolean;
  wrap?: boolean;
  type?: string;
  color?: string;
};

export const ErrorBadge: React.FC<Props> = props => {
  const {
    useVisibility = false,
    error,
    hasError,
    data = {},
    submitError,
    wrap = false,
    type = ERROR_UI_TYPE.TEXT,
    color = COLOR_TYPE.WHITE,
  } = props;

  const message = error || data.error || submitError;

  const renderError = () => (
    <div
      className={classnames(
        classes.errorMessage,
        classes[color],
        (useVisibility || (hasError && !data.showInfoError)) && classes.error,
        useVisibility && hasError && !data.showInfoError && classes.visible,
        useVisibility && !hasError && classes.hidden,
      )}
    >
      {(useVisibility || hasError) && (
        <>
          <FontAwesomeIcon icon="info-circle" className={classes.errorIcon} />
          {message}
        </>
      )}
    </div>
  );

  if (type === ERROR_UI_TYPE.BADGE) {
    return (
      <InfoBadge
        message={message}
        show={hasError}
        title="Try again!"
        type={BADGE_TYPES.ERROR}
      />
    );
  }

  if (wrap) {
    return <div className={classes.regInputWrapper}>{renderError()}</div>;
  }

  return renderError();
};
