import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';

import { ROUTES } from '../../constants/routes';
import Card from '../Card/Card';
import PriceBadge from '../PriceBadge/PriceBadge';
import { ADDRESS_DOMAIN_BADGE_TYPE } from '../../components/AddressDomainBadge/AddressDomainBadge';
import SubmitButton from '../common/SubmitButton/SubmitButton';

import AddressForm from './AddressForm';
import DomainForm from './DomainForm';

import { FORM_NAMES } from '../../constants/form';

import classes from './AddressDomainForm.module.scss';

const FORM_TYPES = {
  [ADDRESS_DOMAIN_BADGE_TYPE.ADDRESS]: {
    title: 'Create FIO Crypto Handle',
    subtitle:
      'Registering a FIO Crypto Handle is fast and easy. Simply add a username and select a domain.',
  },
  [ADDRESS_DOMAIN_BADGE_TYPE.DOMAIN]: {
    title: 'Purchase a FIO Domain',
    subtitle:
      'Purchase a FIO domain is fast and easy. Simply search for a domain to see availability',
  },
};

const FormContainer = props => {
  const {
    isHomepage,
    formProps,
    type,
    isAddress,
    toggleShowAvailable,
    handleChange,
    formState,
    debouncedHandleChange,
    showPrice,
    hasFreeAddress,
    domains,
    isDomain,
    isDesktop,
    links = {},
  } = props;

  const buttonText = `Get My FIO ${isDomain ? 'Domain' : 'Crypto Handle'}`;

  useEffect(() => {
    if (!isHomepage && isAddress && !isEmpty(formState)) {
      const { handleSubmit } = formProps || {};
      handleSubmit();
    }
  }, []);

  const renderActionButton = () => {
    if (!isHomepage) return null;
    if (links && links.getCryptoHandle) {
      return (
        <a
          href={links.getCryptoHandle}
          className={`${classes.link} d-flex justify-content-center`}
          target="_blank"
          rel="noreferrer"
        >
          <SubmitButton
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
        to={ROUTES.FIO_ADDRESSES_SELECTION}
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
      handleChange(form);
    };

    const debouncedOnChangeHandleField = () => {
      toggleShowAvailable(false);
      debouncedHandleChange(form);
    };

    const propsToForm = {
      ...props,
      onChangeHandleField,
      debouncedOnChangeHandleField,
    };

    return (
      <form
        onSubmit={handleSubmit}
        className={classes.form}
        key="form"
        id="addressForm"
      >
        <div className={classes.selectionContainer}>
          {isHomepage ? (
            <AddressForm {...propsToForm} formName={FORM_NAMES.ADDRESS} />
          ) : isAddress ? (
            <AddressForm {...propsToForm} />
          ) : (
            <DomainForm {...propsToForm} />
          )}
        </div>
        {(isHomepage || isDesktop) && (
          <PriceBadge
            showPrice={showPrice}
            hasFreeAddress={hasFreeAddress}
            domains={domains}
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
      title={FORM_TYPES[type].title}
      subtitle={FORM_TYPES[type].subtitle}
      key="form"
    >
      {renderFormBody()}
    </Card>
  );
};

export default FormContainer;
