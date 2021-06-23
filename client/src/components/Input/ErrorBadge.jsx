import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import classes from './Input.module.scss';

export const ErrorBadge = props => {
  const { error, hasError, data, submitError, wrap = false } = props;
  const renderError = () => (
    <div
      className={classnames(
        classes.errorMessage,
        hasError && !data.showInfoError && classes.error,
      )}
    >
      <FontAwesomeIcon icon="info-circle" className={classes.errorIcon} />
      {hasError && (error || data.error || submitError)}
    </div>
  );

  if (wrap) {
    return <div className={classes.regInputWrapper}>{renderError()}</div>;
  }

  return renderError();
};
