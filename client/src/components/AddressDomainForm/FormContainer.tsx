import React from 'react';
import { Link } from 'react-router-dom';
import { FormApi } from 'final-form';
import { isEmpty } from 'lodash';

import Card from '../Card/Card';
import PriceBadge from './PriceBadge';
import SubmitButton from '../common/SubmitButton/SubmitButton';
import AddressForm from './AddressForm';
import DomainForm from './DomainForm';

import { ROUTES } from '../../constants/routes';
import { ADDRESS_FORM_CONTENT } from './constants';

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
    allowCustomDomains,
    isValidating,
    toggleShowCustomDomain,
    toggleShowAvailable,
    handleChange,
    debouncedHandleChange,
  } = props;

  const buttonText = `Get My FIO ${isDomain ? 'Domain' : 'Crypto Handle'}`;

  useEffectOnce(() => {
    if (!isHomepage && isAddress && !isEmpty(formProps)) {
      const { handleSubmit, values } = formProps || {};
      if (!isEmpty(values)) {
        handleSubmit();
      }
    }
  }, [isHomepage, isAddress, formProps]);

  const renderActionButton = () => {
    if (!isHomepage) return null;

    const {
      values: { address = '', domain: domainValue = '' },
    } = formProps;

    const queryString: string = `?address=${address}&domain=${domainValue}`;

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
            variant="primary"
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
          variant="primary"
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
      allowCustomDomains,
      isValidating,
      toggleShowCustomDomain,
      onChangeHandleField,
      debouncedOnChangeHandleField,
    };

    return (
      <form
        onSubmit={() => {
          handleSubmit();
        }}
        className={classes.form}
        key="form"
        id="addressForm"
      >
        <div className={classes.selectionContainer}>
          {isAddress ? (
            <AddressForm {...propsToForm} />
          ) : (
            <DomainForm {...propsToForm} />
          )}
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
        {renderActionButton()}
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
