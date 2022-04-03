import React from 'react';
import { useForm } from 'react-final-form';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import TooltipComponent from '../Tooltip/Tooltip';
import PriceComponent from './PriceComponent';

import { isFreeDomain } from '../../utils';

import { PriceBadgeProps } from './types';

import classes from './styles/PriceBadge.module.scss';

const PriceBadge: React.FC<PriceBadgeProps> = props => {
  const {
    tooltip,
    hasFreeAddress,
    domains,
    hasCustomDomain,
    isFree,
    isDomain,
    roe,
    prices,
  } = props;

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
        <PriceComponent
          isFree={isFree}
          isDomain={isDomain}
          hasCustomDomain={hasCustomDomain}
          hasCurrentDomain={hasCustomDomain}
          roe={roe}
          prices={prices}
        />
      </div>
      {showTooltip && (
        <div className={classes.tooltip}>
          <TooltipComponent id={values.domain}>{tooltip}</TooltipComponent>
        </div>
      )}
    </div>
  );
};

export default PriceBadge;
