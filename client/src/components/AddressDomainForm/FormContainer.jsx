import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import Card from '../Card/Card';
import { ADDRESS_DOMAIN_BADGE_TYPE } from '../../components/AddressDomainBadge/AddressDomainBadge';

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
    prices,
    loading,
    showPrice,
  } = props;

  const renderFormBody = () => {
    const { handleSubmit } = formProps;

    return (
      <form onSubmit={handleSubmit} className={classes.form} key="form">
        {isAddress || isHomepage ? (
          <AddressForm {...props} />
        ) : (
          <DomainForm prices={prices} showPrice={showPrice} />
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
            disabled={loading}
            onClick={handleSubmit}
            variant="primary"
          >
            {loading ? (
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
