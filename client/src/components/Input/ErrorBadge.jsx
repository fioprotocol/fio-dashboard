import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import { BADGE_TYPES } from '../Badge/Badge';
import InfoBadge from '../InfoBadge/InfoBadge';
import classes from './Input.module.scss';

export const ERROR_UI_TYPE = {
  TEXT: 'TEXT',
  BADGE: 'BADGE',
};

export const COLOR_TYPE = {
  WHITE: 'white',
  WARN: 'warn',
};

export const ErrorBadge = props => {
  const {
    error,
    hasError,
    data = {},
    submitError,
    wrap = false,
    type = ERROR_UI_TYPE.TEXT,
    color = COLOR_TYPE.WHITE,
  } = props;
  const renderError = () => (
    <div
      className={classnames(
        classes.errorMessage,
        classes[color],
        hasError && !data.showInfoError && classes.error,
      )}
    >
      <FontAwesomeIcon icon="info-circle" className={classes.errorIcon} />
      {hasError && (error || data.error || submitError)}
    </div>
  );

  if (type === ERROR_UI_TYPE.BADGE) {
    return (
      <InfoBadge
        message={error}
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
