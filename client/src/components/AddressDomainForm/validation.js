import { isEmpty } from 'lodash';
import apis from '../../api/index';
import { ADDRESS_REGEXP } from '../../constants/regExps';

const verifyAddress = async props => {
  const {
    formProps,
    toggleAvailable,
    options,
    changeFormErrors,
    isAddress,
    toggleValidating,
  } = props;
  const { mutators } = formProps;
  const { domain, address } = formProps.getState().values;

  const errors = {};
  toggleValidating(true);
  if (domain) {
    const isAvail = await apis.fio.availCheck(domain);

    if (isAvail && isAvail.is_registered === 1) {
      if (isAddress && options.every(option => option !== domain)) {
        errors.domain =
          'Unfortunately the domain name you have selected is not available. Please select an alternative.';
      }
      if (!isAddress) {
        errors.domain =
          'Unfortunately the domain name you have selected is not available. Please select an alternative.';
      }
    }
  }

  if (address && domain) {
    const isAvail = await apis.fio.availCheck(`${address}@${domain}`);
    if (isAvail && isAvail.is_registered === 1) {
      errors.address = 'This FIO Address is already registered.';
    }
  }

  toggleAvailable(isEmpty(errors));

  mutators.setDataMutator('address', {
    error: errors.address,
    valid: !!errors.address,
  });
  mutators.setDataMutator('domain', {
    error: errors.domain,
    valid: !!errors.domain,
  });
  changeFormErrors(errors);
  toggleValidating(false);
};

export const addressValidation = async props => {
  const { formProps, toggleAvailable, changeFormErrors, cartItems } = props;
  const { mutators, getState } = formProps;

  const errors = {};
  const { address, domain } = getState().values || {};

  if (!address) {
    errors.address = 'Username Field Should Be Filled';
  }
  if (address && !ADDRESS_REGEXP.test(address)) {
    errors.address =
      'Username only allows letters, numbers and dash in the middle';
  }

  if (!domain) {
    errors.domain = 'Select Domain Please';
  }
  if (!ADDRESS_REGEXP.test(domain)) {
    errors.domain =
      'Domain name only allows letters, numbers and dash in the middle';
  }
  if (domain && domain.length > 62) {
    errors.address = 'Domain name should be less than 62 characters';
  }

  if (address && domain && address.length + domain.length > 63) {
    errors.address = 'Address should be less than 63 characters';
  }
  if (
    address &&
    domain &&
    cartItems.some(
      item =>
        item.address === address.toLowerCase() &&
        item.domain === domain.toLowerCase(),
    )
  ) {
    errors.address = 'This address is on a cart';
  }

  if (!isEmpty(errors)) {
    toggleAvailable(false);
    mutators.setDataMutator('address', {
      error: errors.address,
      valid: !errors.address,
    });
    mutators.setDataMutator('domain', {
      error: errors.domain,
      valid: !errors.domain,
    });

    changeFormErrors(errors);
  } else {
    verifyAddress(props);
  }
};

export const domainValidation = props => {
  const { formProps, toggleAvailable, changeFormErrors, cartItems } = props;
  const errors = {};
  const { mutators, getState } = formProps;
  const { domain } = getState().values || {};

  if (!domain) {
    errors.domain = 'Select Domain Please';
  }
  if (!ADDRESS_REGEXP.test(domain)) {
    errors.domain =
      'Domain name only allows letters, numbers and dash in the middle';
  }
  if (domain && domain.length > 62) {
    errors.domain = 'Domain name should be less than 62 characters';
  }
  if (
    domain &&
    cartItems.some(
      item => !item.address && item.domain === domain.toLowerCase(),
    )
  ) {
    errors.domain = 'This domain is on a cart';
  }

  if (!isEmpty(errors)) {
    toggleAvailable(false);
    mutators.setDataMutator('domain', {
      error: errors.domain,
      valid: !errors.domain,
    });
    changeFormErrors(errors);
  } else {
    verifyAddress(props);
  }
};
