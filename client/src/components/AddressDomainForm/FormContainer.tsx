import React from 'react';
import { Link } from 'react-router-dom';
import { FormApi } from 'final-form';
import isEmpty from 'lodash/isEmpty';
import classnames from 'classnames';

import Card from '../Card/Card';
import SubmitButton from '../common/SubmitButton/SubmitButton';
import { ExclamationIcon } from '../ExclamationIcon';

import PriceBadge from './PriceBadge';
import AddressForm from './AddressForm';
import DomainForm from './DomainForm';

import { ROUTES } from '../../constants/routes';
import { ADDRESS_FORM_CONTENT } from './constants';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import useEffectOnce from '../../hooks/general';

import { FormContainerProps, FormValuesProps } from './types';

import classes from './AddressDomainForm.module.scss';

const FormContainer: React.FC<FormContainerProps> = props => {
  const {
    isHomepage,
    formProps,
    type,
    isAddress,
    hasFreeAddress,
    domains,
    isDomain,
    isDesktop,
    links,
    hasCustomDomain,
    isFree,
    roe,
    prices,
    showCustomDomain,
    options,
    domain,
    isValidating,
    toggleShowCustomDomain,
    toggleShowAvailable,
    handleChange,
    debouncedHandleChange,
    isReverseColors,
    isDarkWhite,
  } = props;

  const buttonText = 'GET IT';

  useEffectOnce(() => {
    if (!isHomepage && !isEmpty(formProps)) {
      const { handleSubmit, values } = formProps || {};
      if (!isEmpty(values)) {
        handleSubmit();
      }
    }
  }, [isHomepage, formProps]);

  const renderActionButton = () => {
    if (!isHomepage) return null;

    const {
      values: { address = '', domain: domainValue = '' },
    } = formProps;

    const queryString: string = `?${QUERY_PARAMS_NAMES.ADDRESS}=${address}&${QUERY_PARAMS_NAMES.DOMAIN}=${domainValue}`;

    if (links && links.getCryptoHandle) {
      const link = links.getCryptoHandle.toString() + queryString;

      return (
        <a
          className={`${classes.link} d-flex justify-content-center`}
          href={link}
          target="_blank"
          rel="noreferrer"
        >
          <SubmitButton
            isButtonType={true}
            hasLowHeight={true}
            text={buttonText}
            hasSmallText={true}
            isWhiteBordered={isReverseColors}
          />
        </a>
      );
    }

    return (
      <Link
        to={`${ROUTES.FIO_ADDRESSES_SELECTION}${queryString}`}
        className={`${classes.link} d-flex justify-content-center`}
      >
        <SubmitButton
          hasLowHeight={true}
          text={buttonText}
          hasSmallText={true}
          isWhiteBordered={isReverseColors}
        />
      </Link>
    );
  };

  const renderFormBody = () => {
    const { handleSubmit, form } = formProps;

    const onChangeHandleField = () => {
      toggleShowAvailable(false);
      handleChange(form as FormApi<FormValuesProps, FormValuesProps>);
    };

    const debouncedOnChangeHandleField = () => {
      toggleShowAvailable(false);
      debouncedHandleChange(form as FormApi<FormValuesProps, FormValuesProps>);
    };

    const propsToForm = {
      hasCustomDomain,
      showCustomDomain,
      options,
      domain,
      isValidating,
      toggleShowCustomDomain,
      isReverseColors,
      isDarkWhite,
      onChangeHandleField,
      debouncedOnChangeHandleField,
    };

    return (
      <form
        onSubmit={() => {
          handleSubmit();
        }}
        className={classnames(
          classes.form,
          isReverseColors && classes.isReverseColors,
          isDarkWhite && classes.isDarkWhite,
        )}
        key="form"
        id="addressForm"
      >
        <div className={classes.selectionContainer}>
          {isAddress ? (
            <AddressForm {...propsToForm} />
          ) : (
            <DomainForm {...propsToForm} />
          )}
          {renderActionButton()}
        </div>
        {(isHomepage || isDesktop) && (
          <PriceBadge
            hasFreeAddress={hasFreeAddress}
            hasCustomDomain={hasCustomDomain}
            isFree={isFree}
            isDomain={isDomain}
            domains={domains}
            roe={roe}
            prices={prices}
            tooltip={
              <>
                <span className="boldText">FIO Crypto Handle Cost</span>
                <span>
                  {' '}
                  - FIO Crypto Handle Cost will fluctuate based on market
                  condition. In addition, if you are already have a free public
                  address, there will be cost associated with another address
                </span>
              </>
            }
          />
        )}
        <div className={classes.actionTextContainer}>
          <ExclamationIcon
            isBlackWhite={!isReverseColors && !isDarkWhite}
            isWhiteIndigo={isReverseColors && !isDarkWhite}
            isWhiteBlack={isDarkWhite && !isReverseColors}
          />
          <span className={classes.actionText}>
            You can pay with a credit card OR crypto!
          </span>
        </div>
      </form>
    );
  };

  return isHomepage ? (
    renderFormBody()
  ) : (
    <Card
      title={ADDRESS_FORM_CONTENT[type].title}
      subtitle={ADDRESS_FORM_CONTENT[type].subtitle}
      key="form"
    >
      {renderFormBody()}
    </Card>
  );
};

export default FormContainer;
