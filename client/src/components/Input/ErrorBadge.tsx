import React, { ReactElement } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import BlockIcon from '@mui/icons-material/Block';

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

const DEFAULT_ERROR_BADGE_TITLE = 'Try again!';

type Props = {
  error?: string | null | ReactElement;
  hasError: boolean;
  hideErrorTitle?: boolean;
  data?: { [key: string]: AnyType };
  submitError?: boolean;
  useVisibility?: boolean;
  wrap?: boolean;
  title?: string;
  type?: string;
  color?: string;
  useBlockIcon?: boolean;
};

export const ErrorBadge: React.FC<Props> = props => {
  const {
    useVisibility = false,
    error,
    hasError,
    hideErrorTitle,
    data = {},
    submitError,
    wrap = false,
    title = DEFAULT_ERROR_BADGE_TITLE,
    type = ERROR_UI_TYPE.TEXT,
    color = COLOR_TYPE.WHITE,
    useBlockIcon,
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
          {useBlockIcon ? (
            <BlockIcon className={classes.errorIcon} />
          ) : (
            <FontAwesomeIcon icon="info-circle" className={classes.errorIcon} />
          )}
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
        title={!hideErrorTitle && title}
        type={BADGE_TYPES.ERROR}
      />
    );
  }

  if (wrap) {
    return <div className={classes.regInputWrapper}>{renderError()}</div>;
  }

  return renderError();
};
