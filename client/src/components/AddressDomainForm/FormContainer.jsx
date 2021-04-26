import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';

import { ROUTES } from '../../constants/routes';
import Card from '../Card/Card';
import { ADDRESS_DOMAIN_BADGE_TYPE } from '../../components/AddressDomainBadge/AddressDomainBadge';
import { FORM_NAMES } from '../../constants/form';

import AddressForm from './AddressForm';
import DomainForm from './DomainForm';

import classes from './AddressDomainForm.module.scss';

const FORM_TYPES = {
  [ADDRESS_DOMAIN_BADGE_TYPE.ADDRESS]: {
    title: 'Create FIO Address',
    subtitle:
      'Registering a FIO Address is fast and easy. Simply add a username and select a domain.',
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
    isValidating,
    toggleAvailable,
    handleChange,
    formState,
  } = props;

  useEffect(() => {
    if (!isHomepage && isAddress && !isEmpty(formState)) {
      const { handleSubmit } = formProps || {};
      handleSubmit();
    }
  }, []);

  const renderFormBody = () => {
    const { handleSubmit, form } = formProps;

    const onChangeHandleField = () => {
      toggleAvailable(false);
      handleChange(form);
    };

    const onBlurHandleField = name => {
      const fieldState = form.getFieldState(name);
      const { change, value } = fieldState || {};
      fieldState && change(value.toLowerCase());
      handleChange(form);
    };

    const propsToForm = {
      ...props,
      onChangeHandleField,
      onBlurHandleField,
    };

    return (
      <form onSubmit={handleSubmit} className={classes.form} key="form">
        {isHomepage ? (
          <AddressForm {...propsToForm} formName={FORM_NAMES.ADDRESS} />
        ) : isAddress ? (
          <AddressForm {...propsToForm} />
        ) : (
          <DomainForm {...propsToForm} />
        )}
        {isHomepage ? (
          <Link to={ROUTES.FIO_ADDRESSES} className={classes.link}>
            <Button variant="primary" className={classes.submit}>
              <FontAwesomeIcon icon="search" />
            </Button>
          </Link>
        ) : (
          <Button
            htmltype="submit"
            className={classes.submit}
            disabled={isValidating}
            onClick={handleSubmit}
            variant="primary"
          >
            {isValidating ? (
              <FontAwesomeIcon icon="spinner" spin />
            ) : (
              <FontAwesomeIcon icon="search" />
            )}
          </Button>
        )}
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
