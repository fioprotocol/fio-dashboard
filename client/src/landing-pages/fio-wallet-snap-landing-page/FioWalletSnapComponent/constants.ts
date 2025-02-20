import { Action } from '@fioprotocol/fiosdk';

export const CUSTOM_ACTION_NAME = 'customAction';
export const DECRYPT_FIO_REQUEST_CONTENT_NAME = 'decryptContent';
export const DECRYPT_OBT_DATA_CONTENT_NAME = 'decryptObtDataContent';
export const ENCRYPT_FIO_REQUEST_CONTENT_NAME = 'encryptContent';
export const ENCRYPT_OBT_DATA_CONTENT_NAME = 'encryptObtDataContent';

export const FIO_ACTIONS_OBJECT_LIST = [
  {
    id: Action.addBundledTransactions,
    name: 'Add Bundles',
  },
  { id: Action.addNft, name: 'Add NFT' },
  {
    id: Action.addPublicAddresses,
    name: 'Add Public Address',
  },
  {
    id: Action.setDomainPublic,
    name: 'Change FIO Domain Visibility',
  },
  {
    id: Action.regAddress,
    name: 'Register FIO Handle',
  },
  {
    id: Action.regDomain,
    name: 'Register FIO Domain',
  },
  {
    id: Action.renewDomain,
    name: 'Renew FIO Domain',
  },
  {
    id: Action.removeAllAddresses,
    name: 'Remove All Public Addresses',
  },
  {
    id: Action.removeAddress,
    name: 'Remove Public Address',
  },
  {
    id: Action.stake,
    name: 'Stake FIO Tokens',
  },
  {
    id: Action.transferAddress,
    name: 'Transfer FIO Address',
  },
  {
    id: Action.transferDomain,
    name: 'Transfer FIO Domain',
  },
  {
    id: Action.transferTokensKey,
    name: 'Transfer FIO Tokens',
  },
  {
    id: Action.unstake,
    name: 'Unstake FIO Tokens',
  },
  {
    id: Action.newFundsRequest,
    name: 'Create FIO Request',
  },
  {
    id: Action.cancelFundsRequest,
    name: 'Cancel FIO Request',
  },
  {
    id: Action.recordObt,
    name: 'Record Obt Data',
  },
  {
    id: Action.rejectFundsRequest,
    name: 'Reject FIO Request',
  },
  {
    id: Action.wrapDomain,
    name: 'Wrap FIO Domain',
  },
  {
    id: Action.wrapTokens,
    name: 'Wrap FIO Tokens',
  },
  {
    id: ENCRYPT_FIO_REQUEST_CONTENT_NAME,
    name: 'Encrypt content for FIO Request',
  },
  {
    id: ENCRYPT_OBT_DATA_CONTENT_NAME,
    name: 'Encrypt content for OBT Data Record',
  },
  {
    id: DECRYPT_FIO_REQUEST_CONTENT_NAME,
    name: 'Decrypt content from FIO Request',
  },
  {
    id: DECRYPT_OBT_DATA_CONTENT_NAME,
    name: 'Decrypt content from OBT Data Record',
  },
  {
    id: CUSTOM_ACTION_NAME,
    name: 'Custom action',
  },
];
