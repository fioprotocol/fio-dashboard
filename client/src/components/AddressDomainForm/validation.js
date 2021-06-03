import { isEmpty } from 'lodash';
import apis from '../../api/index';
import { ADDRESS_REGEXP } from '../../constants/regExps';

const verifyAddress = async props => {
  const {
    formProps,
    toggleShowAvailable,
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

  toggleShowAvailable(isEmpty(errors));

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
  const { formProps, toggleShowAvailable, changeFormErrors } = props;
  const { mutators, getState } = formProps;
  const { values, modified } = getState();

  const errors = {};
  const { address, domain } = values || {};

  if (!address || !modified.domain) return;
  // todo: show this error separately only on search icon click
  // {
  //   errors.address = 'Address Field Should Be Filled';
  // }

  if (address && !ADDRESS_REGEXP.test(address)) {
    errors.address =
      'Address only allows letters, numbers and dash in the middle';
  }

  if (!domain && modified.domain) {
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

  if (!isEmpty(errors)) {
    toggleShowAvailable(false);
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
  const { formProps, toggleShowAvailable, changeFormErrors, cartItems } = props;
  const errors = {};
  const { mutators, getState } = formProps;
  const { domain } = getState().values || {};

  if (!domain) return;
  // todo: show this error separately only on search icon click
  // {
  //   errors.domain = 'Domain Field Should Be Filled';
  // }
  if (!ADDRESS_REGEXP.test(domain)) {
    errors.domain =
      'Domain name only allows letters, numbers and dash in the middle';
  }
  if (domain && domain.length > 62) {
    errors.domain = 'Domain name should be less than 62 characters';
  }
  if (domain && cartItems.some(item => item.domain === domain.toLowerCase())) {
    errors.domain = {};
    errors.domain['message'] =
      'This domain has already been added to your cart';

    errors.domain['showInfoError'] = true;
  }

  if (!isEmpty(errors)) {
    toggleShowAvailable(false);
    mutators.setDataMutator('domain', {
      error: errors.domain,
      valid: !errors.domain,
    });
    changeFormErrors(errors);
  } else {
    verifyAddress(props);
  }
};
