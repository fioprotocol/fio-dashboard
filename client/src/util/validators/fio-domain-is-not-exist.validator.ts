import { FieldValidationFunctionAsync } from '@lemoncode/fonk';

import apis from '../../api';

interface MatchFieldArgs {
  fieldId?: string;
}

export const fioDomainIsNotExistValidator: FieldValidationFunctionAsync<MatchFieldArgs> = async props => {
  const { message, value } = props;

  let succeeded = true;
  let errorMessage = '';

  try {
    const params = apis.fio.setTableRowsParams(value);

    const { rows } = await apis.fio.getTableRows(params);

    if (!rows.length) {
      succeeded = false;
      errorMessage = typeof message === 'string' ? message : message?.[0];
    }
  } catch (e) {
    succeeded = false;
    errorMessage = 'Something went wrong on domain validation';
  }

  return {
    succeeded,
    message: errorMessage,
    type: 'FIO_DOMAIN_VALID',
  };
};
