import { FieldValidationFunctionAsync } from '@lemoncode/fonk';

import { FioNameItemProps } from '../../types';

interface MatchFieldArgs {
  fieldId?: string;
}

export const fioDomainWatchlistValidator: FieldValidationFunctionAsync<MatchFieldArgs> = async props => {
  const { message, values } = props;

  const { domain } = values;

  const domainsWatchlistList = values.domainsWatchlistList as FioNameItemProps[];

  let succeeded = true;
  let errorMessage = '';

  if (
    domainsWatchlistList.find(
      domainsWatchlistItem => domainsWatchlistItem.name === domain,
    )
  ) {
    succeeded = false;
    errorMessage = typeof message === 'string' ? message : message?.[0];
  }

  return {
    succeeded,
    message: errorMessage,
    type: 'FIO_DOMAIN_IN_WATCHLLIST',
  };
};
