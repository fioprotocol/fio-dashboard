import { FIO_ADDRESS_DELIMITER } from '../config/constants.js';

export const generateErrorResponse = (res, { error, errorCode, statusCode }) => {
  res.status(statusCode);
  return { error, errorCode, success: false };
};

export const generateSuccessResponse = (res, { accountId, charge }) => ({
  error: false,
  account_id: accountId,
  success: charge ? { charge } : true,
});

export const formatChainDomain = domain => {
  if (!domain) {
    return;
  }
  const { id, name, domainhash, account, is_public, expiration } = domain;
  return {
    id,
    name,
    domainHash: domainhash,
    account,
    isPublic: is_public === 1,
    expiration,
  };
};

export const destructAddress = address => {
  let fioAddress = null;
  let fioDomain;

  if (address.includes(FIO_ADDRESS_DELIMITER)) {
    const [handle, domain] = address.split(FIO_ADDRESS_DELIMITER);
    fioAddress = handle;
    fioDomain = domain;
  } else {
    fioDomain = address;
  }

  const type = fioAddress ? 'account' : 'domain';

  return { type, fioAddress, fioDomain };
};
