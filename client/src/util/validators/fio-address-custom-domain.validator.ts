import {
  FieldValidationFunctionSync,
  FieldValidationFunctionAsync,
} from '@lemoncode/fonk';

import { allRules } from '@fioprotocol/fiosdk';

import {
  DOMAIN_ALREADY_EXISTS,
  FIO_ADDRESS_ALREADY_EXISTS,
  NON_VALID_FCH,
  NON_VAILD_DOMAIN,
} from '../../constants/errors';
import { WARNING_CONTENT } from '../../pages/FioAddressManagePage/constants';

import apis from '../../api';
import { setFioName } from '../../utils';
import {
  checkAddressOrDomainIsExist,
  isDomainExpired,
  validateFioDomain,
} from '../fio';
import { fireAnalyticsEventDebounced } from '../analytics';

import { ANALYTICS_EVENT_ACTIONS } from '../../constants/common';

import { RefProfileDomain, UserDomainType } from '../../types';

interface MatchFieldArgs {
  fieldId?: string;
}

export const fioAddressFieldValidator: FieldValidationFunctionSync<MatchFieldArgs> = props => {
  const { value } = props;

  const succeeded = allRules.fioName.match.test(value);

  return {
    succeeded,
    message: NON_VALID_FCH,
    type: 'FIO_ADDRESS_HANDLE_VALID',
  };
};

export const fioAddressCustomDomainValidator: FieldValidationFunctionAsync<MatchFieldArgs> = async props => {
  const { values } = props;

  const { address, domain } = values;

  const userDomains = values.userDomains as UserDomainType[];
  const gatedDomains = values.gatedDomains as RefProfileDomain[];

  const currentDomainGated = gatedDomains.find(
    gatedDomain => gatedDomain.name === domain,
  );

  let existingUserDomain = null;

  if (userDomains.length) {
    existingUserDomain = userDomains.find(
      userDomain => userDomain.name === domain,
    );
  }

  let succeeded = true;
  let message = '';

  if (currentDomainGated) {
    succeeded = false;
    message = DOMAIN_ALREADY_EXISTS;
  }

  const fchValue = setFioName(address, domain);

  fireAnalyticsEventDebounced(ANALYTICS_EVENT_ACTIONS.SEARCH_ITEM);

  if (address) {
    if (
      !apis.fio.publicFioSDK.validateFioAddress(fchValue) ||
      !allRules.fioName.match.test(address)
    ) {
      succeeded = false;
      message = NON_VALID_FCH;
    }
  } else {
    if (validateFioDomain(domain)) {
      succeeded = false;
      message = NON_VAILD_DOMAIN;
    }
  }

  try {
    const isAddressExist = await checkAddressOrDomainIsExist({
      address,
      domain,
      fireAnalytics: fireAnalyticsEventDebounced,
    });
    if (address && isAddressExist) {
      succeeded = false;
      message = FIO_ADDRESS_ALREADY_EXISTS;
    }
    if (!address && isAddressExist && !existingUserDomain) {
      succeeded = false;
      message = DOMAIN_ALREADY_EXISTS;
    }
  } catch (e) {
    succeeded = false;
    message = 'Something went wrong on FIO Handle validation';
  }

  try {
    const params = apis.fio.setTableRowsParams(domain);

    const { rows } = await apis.fio.getTableRows(params);

    if (rows.length) {
      const { expiration, is_public, name } = rows[0];

      if (isDomainExpired(name, expiration)) {
        succeeded = false;
        message = WARNING_CONTENT.EXPIRED_DOMAINS.message;
      }
      if (!is_public && !existingUserDomain) {
        succeeded = false;
        message = DOMAIN_ALREADY_EXISTS;
      }
    }
  } catch (e) {
    succeeded = false;
    message = 'Something went wrong on domain validation';
  }

  return {
    succeeded,
    message,
    type: 'FIO_HANDLE_VALID',
  };
};
