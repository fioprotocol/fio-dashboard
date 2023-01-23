import {
  FieldValidationFunctionSync,
  FieldValidationFunctionAsync,
} from '@lemoncode/fonk';
import { allRules } from '@fioprotocol/fiosdk/lib/utils/validation';

import {
  FIO_ADDRESS_ALREADY_EXISTS,
  NON_VALID_FCH,
} from '../../constants/errors';

import apis from '../../api';
import { setFioName } from '../../utils';
import { checkAddressIsExist } from '../../util/fio';
import { fireAnalyticsEventDebounced } from '../analytics';
import { ANALYTICS_EVENT_ACTIONS } from '../../constants/common';

interface MatchFieldArgs {
  fieldId?: string;
}

export const fioAddressFieldValidator: FieldValidationFunctionSync<MatchFieldArgs> = props => {
  const { value } = props;

  // Get regexp string from full FCH regexp
  const fioAddressRegexString = allRules.fioAddress.matchParams.regex
    .split('@')[0]
    .replace('(?:', '')
    .replace('3,64', '1,62')
    .concat('$');

  const fioAddressRegex = new RegExp(fioAddressRegexString, 'i');
  const succeeded = fioAddressRegex.test(value);

  return {
    succeeded,
    message: NON_VALID_FCH,
    type: 'FIO_ADDRESS_HANDLE_VALID',
  };
};

export const fioAddressCustomDomainValidator: FieldValidationFunctionAsync<MatchFieldArgs> = async props => {
  const { values } = props;

  const { address, domain } = values;

  let succeeded = true;
  let message = '';

  const fchValue = setFioName(address, domain);

  fireAnalyticsEventDebounced(ANALYTICS_EVENT_ACTIONS.SEARCH_ITEM);

  try {
    apis.fio.isFioAddressValid(fchValue);
  } catch (e) {
    succeeded = false;
    message = NON_VALID_FCH;
  }

  try {
    const isAddressExist = await checkAddressIsExist(address, domain);
    if (isAddressExist) {
      succeeded = false;
      message = FIO_ADDRESS_ALREADY_EXISTS;

      fireAnalyticsEventDebounced(
        ANALYTICS_EVENT_ACTIONS.SEARCH_ITEM_ALREADY_USED,
      );
    }
  } catch (e) {
    succeeded = false;
    message = 'Something went wrong';
  }

  return {
    succeeded,
    message,
    type: 'FIO_CRYPTO_HANDLE_VALID',
  };
};
