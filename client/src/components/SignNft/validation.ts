import { NftItem } from '@fioprotocol/fiosdk/src/entities/NftItem';
import apis from '../../api';

const TOKEN_ID_MAX_LENGTH = 64;
const URL_MAX_LENGTH = 128;
const HASH_MAX_LENGTH = 64;
const META_MAX_LENGTH = 64;

export const validate = (values: NftItem) => {
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

  if (values.token_id != null && values.token_id.length > TOKEN_ID_MAX_LENGTH) {
    errors.token_id = 'Not valid token';
  }

  if (values.url != null && values.url.length > URL_MAX_LENGTH) {
    errors.url = 'Not valid url';
  }

  if (values.hash != null && values.hash.length > HASH_MAX_LENGTH) {
    errors.hash = 'Not valid hash';
  }

  if (values.metadata != null) {
    if (values.metadata.length > META_MAX_LENGTH) {
      errors.metadata = 'Metadata is too long';
    }
    try {
      JSON.parse(values.metadata);
    } catch (e) {
      errors.metadata = 'Not valid metadata json';
    }
  }

  return errors;
};
