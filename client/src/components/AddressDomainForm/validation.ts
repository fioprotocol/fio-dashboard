import isEmpty from 'lodash/isEmpty';
import { allRules, validate } from '@fioprotocol/fiosdk/lib/utils/validation';

import { ANALYTICS_EVENT_ACTIONS } from '../../constants/common';

import apis from '../../api/index';

import { setFioName } from '../../utils';
import { fireAnalyticsEventDebounced } from '../../util/analytics';

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
    if (!isAddress) {
      fireAnalyticsEventDebounced(ANALYTICS_EVENT_ACTIONS.SEARCH_ITEM);
    }
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
      fireAnalyticsEventDebounced(ANALYTICS_EVENT_ACTIONS.SEARCH_ITEM);
      const isAvail = await apis.fio.availCheck(setFioName(address, domain));
      if (isAvail && isAvail.is_registered === 1) {
        errors.address = 'This FIO Handle is already registered.';
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
    errors.address = 'FIO Handle Field Should Be Filled';
  }

  if (!domain && !modified.domain) {
    errors.domain = 'Domain Field Should Be Filled';
  }

  const addressValidation = validate(
    { fioAddress: `${address}@${domain}` },
    { fioAddress: allRules.fioAddress },
  );
  if (!addressValidation.isValid) {
    errors.address =
      'FIO Handle only allows letters, numbers and dash in the middle';
  }

  if (!domain && modified.domain) {
    errors.domain = 'Select Domain Please';
  }
  const domainValidation = validate(
    { fioDomain: domain },
    { fioDomain: allRules.fioDomain },
  );
  if (!domainValidation.isValid) {
    errors.domain =
      'Domain name only allows letters, numbers and dash in the middle';
  }
  if (domain && domain.length > 62) {
    errors.address = 'Domain name should be less than 62 characters';
  }

  if (address && domain && address.length + domain.length > 63) {
    errors.address = 'FIO Handle should be less than 63 characters';
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

  const validation = validate(
    { fioDomain: domain },
    { fioDomain: allRules.fioDomain },
  );
  if (!validation.isValid) {
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
