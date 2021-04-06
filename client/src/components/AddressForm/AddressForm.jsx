import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import Input, { INPUT_COLOR_SCHEMA } from '../Input/Input';
import { ROUTES } from '../../constants/routes';
import CustomDropdown from './CustomDropdown';

import classes from './AddressForm.module.scss';

const AddressForm = props => {
  const { loading, options, prices, isHomepage } = props;
  const [isCustomDomain, toggleCustomDomain] = useState(false);

  const validation = values => {
    const errors = {};
    const { username, domain } = values || {};

    if (!username) {
      errors.username = 'Username Field Should Be Filled';
    }

    if (!domain) {
      errors.domain = 'Select Domain Please';
    }

    return errors;
  };

  const showPrice = price => `Cost: ${price} USDC`;

  const renderItems = props => {
    const { handleSubmit } = props;
    return (
      <form onSubmit={handleSubmit} className={classes.form}>
        <Field
          name='username'
          type='text'
          placeholder='Find the perfect username ..'
          colorschema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
          badge={showPrice(prices.address)}
          component={Input}
        />
        <div className={classnames(classes.at, 'boldText')}>@</div>
        <div className={classes.domainContainer}>
          {isCustomDomain ? (
            <Field
              name='domain'
              type='text'
              placeholder='Custom domain'
              colorschema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
              component={Input}
              onClose={toggleCustomDomain}
              badge={showPrice(prices.domain)}
            />
          ) : (
            <Field
              name='domain'
              component={CustomDropdown}
              options={options}
              toggle={toggleCustomDomain}
            />
          )}
        </div>
        {isHomepage ? (
          <Button
            variant='primary'
            className={classes.submit}
          >
            <Link to={ROUTES.FIO_ADDRESSES}>
              <FontAwesomeIcon icon='search' />
            </Link>
          </Button>
        ) : (
          <Button
            htmltype='submit'
            className={classes.submit}
            disabled={loading}
            onClick={handleSubmit}
            variant='primary'
          >
            {loading ? (
              <FontAwesomeIcon icon='spinner' spin />
            ) : (
              <FontAwesomeIcon icon='search' />
            )}
          </Button>
        )}
      </form>
    );
  };

  return (
    <Form onSubmit={() => {}} validate={!isHomepage && validation}>
      {renderItems}
    </Form>
  );
};

export default AddressForm;
