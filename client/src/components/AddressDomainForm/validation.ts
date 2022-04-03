import { isEmpty } from 'lodash';

import apis from '../../api/index';
import { ADDRESS_REGEXP } from '../../constants/regExps';

import { DefaultValidationProps, FormValidationErrorProps } from './types';

const verifyAddress = async (props: DefaultValidationProps) => {
  const {
    formProps,
    options,
    isAddress,
    toggleShowAvailable,
    changeFormErrors,
    toggleValidating,
  } = props;
  const { mutators } = formProps;
  const {
    domain,
    address,
  }: { domain: string; address: string } = formProps.getState().values;

  const errors: FormValidationErrorProps = {};
  toggleValidating(true);
  if (domain) {
    // avail_check returns wrong information about availability of domains, temporary changed to use this
    const isRegistered = await apis.fio.availCheckTableRows(domain);

    if (isRegistered) {
      if (
        isAddress &&
        options.length > 0 &&
        options.every(option => option !== domain)
      ) {
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
    try {
      const isAvail = await apis.fio.availCheckTableRows(
        `${address}@${domain}`,
      );
      if (isAvail) {
        errors.address = 'This FIO Crypto Handle is already registered.';
      }
    } catch (e) {
      errors.address = 'Server error. Please try later.';
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

export const addressValidation = async (
  props: DefaultValidationProps,
): Promise<void> => {
  const { formProps, toggleShowAvailable, changeFormErrors } = props;
  const { mutators, getState } = formProps;
  const { values, modified, submitting } = getState();
  const errors: FormValidationErrorProps = {};
  const { address, domain } = values || {};

  if ((!address || !domain) && !submitting) {
    changeFormErrors(errors);
    mutators.setDataMutator('address', {
      error: errors.address,
      valid: !errors.address,
    });
    mutators.setDataMutator('domain', {
      error: errors.domain,
      valid: !errors.domain,
    });
    return;
  }

  if (!address) {
    errors.address = 'FIO Crypto Handle Field Should Be Filled';
  }

  if (!domain && !modified.domain) {
    errors.domain = 'Domain Field Should Be Filled';
  }

  if (address && !ADDRESS_REGEXP.test(address)) {
    errors.address =
      'FIO Crypto Handle only allows letters, numbers and dash in the middle';
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
    errors.address = 'FIO Crypto Handle should be less than 63 characters';
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

export const domainValidation = (props: DefaultValidationProps): void => {
  const {
    formProps,
    toggleShowAvailable,
    changeFormErrors,
    cartItems,
    options,
  } = props;
  const errors: FormValidationErrorProps = {};
  const { mutators, getState } = formProps;
  const { domain } = getState().values || {};

  if (!domain) return changeFormErrors(errors);
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
  if (
    domain &&
    options.length > 0 &&
    options.every(item => item !== domain) &&
    cartItems.some(item => item.domain === domain.toLowerCase())
  ) {
    errors.domain = {
      message: 'This domain has already been added to your cart',
      showInfoError: true,
    };
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
