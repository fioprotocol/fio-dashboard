import { NftFormValues } from '../../types';
import apis from '../../../../api';

const TOKEN_ID_MAX_LENGTH = 64;
const URL_MAX_LENGTH = 128;
const META_MAX_LENGTH = 128;
const HASH_REGEX = /^[a-f0-9]{64}$/i;

export const validate = (values: NftFormValues) => {
  const errors: any = {};
  if (!values.chainCode) {
    errors.chainCode = 'Required';
  } else {
    try {
      apis.fio.isChainCodeValid(values.chainCode);
    } catch (e) {
      errors.chainCode = 'Not valid chain code';
    }
  }
  if (!values.contractAddress) {
    errors.contractAddress = 'Required';
  } else {
    try {
      apis.fio.isPublicAddressValid(values.contractAddress);
    } catch (e) {
      errors.contractAddress = 'Not valid address';
    }
  }

  if (
    values.tokenId != null &&
    values.tokenId !== '' &&
    values.tokenId.length > TOKEN_ID_MAX_LENGTH
  ) {
    errors.tokenId = 'Not valid token';
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

  if (values.creatorUrl != null) {
    if (
      JSON.stringify({ creator_url: values.creatorUrl }).length >
      META_MAX_LENGTH
    ) {
      errors.creatorUrl = 'Creator URL is too long';
    }
  }

  return errors;
};
