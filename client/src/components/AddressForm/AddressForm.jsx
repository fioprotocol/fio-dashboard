import React, { useState, useEffect } from 'react';
import { Form, Field, FormSpy } from 'react-final-form';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import Card from '../Card/Card';
import Badge, { BADGE_TYPES } from '../Badge/Badge';
import Input, { INPUT_COLOR_SCHEMA } from '../Input/Input';
import { ROUTES } from '../../constants/routes';
import { ADDRESS_REGEXP } from '../../constants/regExps';
import CustomDropdown from './CustomDropdown';
import { sleep } from '../../utils';
import { SCREEN_TYPE } from '../../constants/screen';
import InfoBadge from '../InfoBadge/InfoBadge';

import { currentScreenType } from '../../screenType';

import _ from 'lodash';

import classes from './AddressForm.module.scss';


const AddressForm = props => {
  const {
    loading,
    options,
    prices,
    isHomepage,
    formState,
    formName,
    updateFormState,
    fioAmount,
    // cart, //todo: replace with cart data
  } = props;

  const { screenType } = currentScreenType();
  const isDesktop = screenType === SCREEN_TYPE.DESKTOP;

  const [isCustomDomain, toggleCustomDomain] = useState(false);
  const [isAvailable, toggleAvailable] = useState(false);
  const [cartItems, updateCart] = useState([]); //todo: replace with cart data

  const verifyAddress = async values => {
    const { domain, username } = values;
    const errors = {};

    //todo: mocked request call 
    const availCheck = async () => {
      await sleep (1000)
      return {is_registered: 0};
    };

    if (domain) {
      const isAvail = await availCheck();
      if (
        isAvail &&
        isAvail.is_registered === 1 &&
        options.every((option) => option !== domain)
      ) {
        errors.domain =
          'Unfortunately the domain name you have selected is not available. Please select an alternative.';
      }
    }

    if (username && domain) {
      const isAvail = await availCheck();
      if (isAvail && isAvail.is_registered === 1) {
        errors.username = 'This FIO Address is already registered.';
      }
    }

    if (_.isEmpty(errors)) {
      toggleAvailable(true);
    }
    
    return errors;
  };

  const { domain } = formState;

  useEffect(() => {
    if (!isHomepage && domain && options.every(option => option !== domain)) {
      toggleCustomDomain(true);
    }
  }, []);

  const updateFormStateCurrent = (form, state) => {
    updateFormState(form, state);
  };

  const validation = async values => {
    const errors = {};
    const { username, domain } = values || {};

    if (!username) {
      errors.username = 'Username Field Should Be Filled';
    }
    if (username && !ADDRESS_REGEXP.test(username)) {
      errors.username = 'Username only allows letters, numbers and dash';
    }

    if (!domain) {
      errors.domain = 'Select Domain Please';
    }
    if (!ADDRESS_REGEXP.test(domain)) {
      errors.domain = 'Domain name only allows letters, numbers and dash';
    }
    if (domain && domain.length > 62) {
      errors.username = 'Domain name should be less than 62 characters';
    }

    if (username && domain && (username.length + domain.length > 63)) {
      errors.username = 'Address should be less than 63 characters';
    }

    if (!_.isEmpty(errors)) {
      toggleAvailable(false);
    }

    return !_.isEmpty(errors) ? errors : verifyAddress(values);
  };

  const showPrice = (price) =>
    `${isDesktop ? 'Cost: ' : ''}${price} USDC`;

  const renderNotifications = props => {
    const { values, errors, touched, modified } = props;
    const { username, domain: domainName } = values || {};
    const { domain: domainPrice, address: addressPrice } = prices;
 
    const isOnCart = cartItems.some(item => JSON.stringify(item) === JSON.stringify(values));
    const hasErrors = !_.isEmpty(errors);
    const hasFields = !_.isEmpty(touched);
    let price = parseInt(addressPrice);

    if(isCustomDomain) {
      price += parseInt(domainPrice);
    }

    const notifBadge = () => {
      const anyTouched = Object.values(touched).some(val => val === true);
      const anyModified = Object.values(modified).some(val => val === true);

      return (
        <>
          <InfoBadge
            type={BADGE_TYPES.SUCCESS}
            show={isAvailable}
            title='Available!'
            message='The FIO address you requested is available'
          />
          {Object.keys(errors).map((key) => {
            const message = errors[key];

            return (
              <InfoBadge
                type={BADGE_TYPES.ERROR}
                title='Try Again!'
                show={hasFields && hasErrors && anyTouched && anyModified}
                message={message}
                key={key}
              />
            );
          })}
        </>
      );
    }

    return (
      <div key='badges'>
        {notifBadge()}
        <Badge type={BADGE_TYPES.SIMPLE} show={isAvailable}>
          <div
            className={classnames(
              classes.addressContainer,
              !hasErrors && classes.showPrice
            )}
          >
            <p className={classes.address}>
              <span className={classes.name}>{username}</span>@{domainName}
            </p>
            <p className={classes.price}>
              ${price.toFixed(2)}{' '}
              {fioAmount && (
                <span className={classes.fioAmount}>({fioAmount} FIO)</span>
              )}
            </p>
            <div className={classes.actionContainer}>
              <Button
                className={classnames(
                  classes.button,
                  !isOnCart && classes.show
                )}
                onClick={() => updateCart([...cartItems, values])} //todo: set add item to cart action
              >
                <FontAwesomeIcon icon='plus-square' className={classes.icon} />
                Add to Cart
              </Button>
              <div
                className={classnames(classes.added, isOnCart && classes.show)}
              >
                <div className={classes.fioBadge}>
                  <FontAwesomeIcon
                    icon='check-circle'
                    className={classes.icon}
                  />
                  <p className={classes.title}>Added</p>
                </div>
                <FontAwesomeIcon
                  icon='times-circle'
                  className={classes.iconClose}
                  onClick={() => {
                    const updArr = cartItems.filter(
                      (item) => JSON.stringify(item) !== JSON.stringify(values)
                    );
                    updateCart(updArr);
                  }} //todo: set remove item from cart action
                />
              </div>
            </div>
          </div>
        </Badge>
      </div>
    );
  }

  const renderFormBody = props => {
    const { handleSubmit } = props;
    return (
      <form onSubmit={handleSubmit} className={classes.form} key='form'>
        {isHomepage && (
          <FormSpy
            onChange={(state) => {
              setTimeout(
                () => updateFormStateCurrent(formName, state.values),
                0
              ); //stupid lib issue, fixed with hack from github issues
            }}
          />
        )}
        <div className={classes.username}>
          <Field
            name='username'
            type='text'
            placeholder='Find the perfect username ..'
            colorschema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
            badge={showPrice(prices.address)}
            component={Input}
            hideerror='true'
          />
        </div>
        <div className={classnames(classes.at, 'boldText')}>@</div>
        <div className={classes.domainContainer}>
          {isCustomDomain ? (
            <Field
              name="domain"
              type="text"
              placeholder="Custom domain"
              colorschema={INPUT_COLOR_SCHEMA.BLACK_AND_WHITE}
              component={Input}
              onClose={toggleCustomDomain}
              badge={showPrice(prices.domain)}
              hideerror='true'
            />
          ) : (
            <Field
              name="domain"
              component={CustomDropdown}
              options={options}
              toggle={toggleCustomDomain}
              initValue={domain}
            />
          )}
        </div>
        {isHomepage ? (
          <Link to={ROUTES.FIO_ADDRESSES} className={classes.link}>
            <Button variant='primary' className={classes.submit}>
              <FontAwesomeIcon icon='search' />
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
  }

  const renderForm = props => { 
    return isHomepage ? (
      renderFormBody(props)
    ) : (
      <Card
        title='Create FIO Address'
        subtitle='Registering a FIO Address is fast and easy. Simply add a username and select a domain.'
        key='form'
      >
        {renderFormBody(props)}
      </Card>
    );
  };

  const renderItems = props => {
    return [renderForm(props), !isHomepage && renderNotifications(props)];
  };

  return (
    <Form
      onSubmit={() => {}}
      validate={!isHomepage && validation}
      initialValues={formState}
    >
      {renderItems}
    </Form>
  );
};

export default AddressForm;
