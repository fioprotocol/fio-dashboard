import { NftFormValues } from './types';
import apis from '../../api';

const TOKEN_ID_MAX_LENGTH = 64;
const URL_MAX_LENGTH = 128;
const META_MAX_LENGTH = 64;
const HASH_REGEX = /^[a-f0-9]{64}$/i;

export const validate = (values: NftFormValues) => {
  const errors: any = {};
  if (!values.chain_code) {
    errors.chain_code = 'Required';
  } else {
    try {
      apis.fio.isChainCodeValid(values.chain_code);
    } catch (e) {
      errors.chain_code = 'Not valid chain code';
    }
  }
  if (!values.contract_address) {
    errors.contract_address = 'Required';
  } else {
    try {
      apis.fio.isPublicAddressValid(values.contract_address);
    } catch (e) {
      errors.contract_address = 'Not valid address';
    }
  }

  if (
    values.token_id != null &&
    values.token_id !== '' &&
    values.token_id.length > TOKEN_ID_MAX_LENGTH
  ) {
    errors.token_id = 'Not valid token';
  }

  if (
    values.url != null &&
    values.url !== '' &&
    values.url.length > URL_MAX_LENGTH
  ) {
    errors.url = 'Not valid url';
  }

  if (
    values.hash != null &&
    values.hash !== '' &&
    !HASH_REGEX.test(values.hash)
  ) {
    errors.hash = 'Not valid hash';
  }

  if (values.creator_url != null) {
    if (
      JSON.stringify({ creator_url: values.creator_url }).length >
      META_MAX_LENGTH
    ) {
      errors.creator_url = 'Creator URL is too long';
    }
  }

  return errors;
};
