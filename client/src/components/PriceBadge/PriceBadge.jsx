import React from 'react';
import { useForm } from 'react-final-form';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import TooltipComponent from '../Tooltip/Tooltip';
import { isFreeDomain } from '../../utils';

import classes from './PriceBadge.module.scss';

const PriceBadge = props => {
  const { showPrice, tooltip, hasFreeAddress, domains } = props;
  const form = useForm();
  const { values } = form && form.getState();
  const hasError =
    !isEmpty(values) &&
    Object.keys(values).some(key => {
      const {
        error,
        data = {},
        touched,
        modified,
        submitSucceeded,
        submitError,
        modifiedSinceLastSubmit,
      } = form.getFieldState(key) || {};

      const hasFieldError =
        ((!isEmpty(error) || data.error) &&
          (touched || modified || submitSucceeded)) ||
        (submitError && !modifiedSinceLastSubmit);
      return hasFieldError;
    });

  const showBadge = !isEmpty(values) && !hasError;
  const showTooltip =
    tooltip &&
    hasFreeAddress &&
    values &&
    values.domain &&
    isFreeDomain({ domains, domain: values.domain });

  const renderPrice = showPrice();

  return (
    <div
      className={classnames(
        classes.badgeContainer,
        showBadge && classes.showBadge,
      )}
    >
      <div
        className={classnames(classes.badge, showBadge && classes.showBadge)}
      >
        {renderPrice}
      </div>
      {showTooltip && (
        <div className={classes.tooltip}>
          <TooltipComponent>{tooltip}</TooltipComponent>
        </div>
      )}
    </div>
  );
};

export default PriceBadge;
