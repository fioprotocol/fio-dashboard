import _ from 'lodash';
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
  const { domain, username } = formProps.getState().values;

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

  if (username && domain) {
    const isAvail = await apis.fio.availCheck(`${username}@${domain}`);
    if (isAvail && isAvail.is_registered === 1) {
      errors.username = 'This FIO Address is already registered.';
    }
  }

  toggleAvailable(_.isEmpty(errors));

  mutators.setDataMutator('username', {
    error: errors.username,
    valid: !!errors.username,
  });
  mutators.setDataMutator('domain', {
    error: errors.domain,
    valid: !!errors.domain,
  });
  changeFormErrors(errors);
  toggleValidating(false);
  return errors;
};

export const addressValidation = async props => {
  const { formProps, toggleAvailable, changeFormErrors } = props;
  const { mutators } = formProps;

  const errors = {};
  const { username, domain } = formProps.getState().values || {};

  if (!username) {
    errors.username = 'Username Field Should Be Filled';
  }
  if (username && !ADDRESS_REGEXP.test(username)) {
    errors.username =
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
    errors.username = 'Domain name should be less than 62 characters';
  }

  if (username && domain && username.length + domain.length > 63) {
    errors.username = 'Address should be less than 63 characters';
  }

  if (!_.isEmpty(errors)) {
    toggleAvailable(false);
  }

  mutators.setDataMutator('username', {
    error: errors.username,
    valid: !errors.username,
  });
  mutators.setDataMutator('domain', {
    error: errors.domain,
    valid: !errors.domain,
  });

  changeFormErrors(errors);

  return !_.isEmpty(errors) ? errors : verifyAddress(props);
};

export const domainValidation = props => {
  const { formProps, toggleAvailable, changeFormErrors } = props;
  const errors = {};
  const { mutators } = formProps;

  const { domain } = formProps.getState().values || {};

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

  if (!_.isEmpty(errors)) {
    toggleAvailable(false);
  }

  mutators.setDataMutator('domain', {
    error: errors.domain,
    valid: !errors.domain,
  });

  changeFormErrors(errors);

  return !_.isEmpty(errors) ? errors : verifyAddress(props);
};
