import { isEmpty } from 'lodash';
import { createHash } from 'crypto-browserify';
import superagent from 'superagent';

import apis from '../../api/index';
import { ADDRESS_REGEXP } from '../../constants/regExps';

const GET_TABLE_ROWS_URL = `${process.env.REACT_APP_FIO_BASE_URL}chain/get_table_rows`;

// avail_check returns wrong information about availability of domains, temporary changed to use this
const checkDomainIsRegistered = async domain => {
  try {
    const hash = createHash('sha1');
    const bound =
      '0x' +
      hash
        .update(domain)
        .digest()
        .slice(0, 16)
        .reverse()
        .toString('hex');
    const response = await superagent.post(GET_TABLE_ROWS_URL).send({
      code: 'fio.address',
      scope: 'fio.address',
      table: 'domains',
      lower_bound: bound,
      upper_bound: bound,
      key_type: 'i128',
      index_position: '4',
      json: true,
    });

    const { rows } = response.body;
    if (rows && rows.length) {
      return !!rows[0].id;
    }
  } catch (e) {
    console.log(e);
  }

  return false;
};

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
    const isRegistered = await checkDomainIsRegistered(domain);

    if (isRegistered) {
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
      errors.address = 'This FIO Crypto Handle is already registered.';
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
  const { values, modified, submitting } = getState();
  const errors = {};
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

export const domainValidation = props => {
  const {
    formProps,
    toggleShowAvailable,
    changeFormErrors,
    cartItems,
    options,
  } = props;
  const errors = {};
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
    options.every(item => item !== domain) &&
    cartItems.some(item => item.domain === domain.toLowerCase())
  ) {
    errors.domain = {};
    errors.domain.message = 'This domain has already been added to your cart';

    errors.domain.showInfoError = true;
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
