import { ACTIONS, TRANSACTION_ACTION_NAMES } from '../../../constants/fio';

export const CUSTOM_ACTION_NAME = 'customAction';

export const FIO_ACTIONS_OBJECT_LIST = [
  {
    id: TRANSACTION_ACTION_NAMES[ACTIONS.addBundledTransactions],
    name: 'Add Bundles',
  },
  { id: TRANSACTION_ACTION_NAMES[ACTIONS.addNft], name: 'Add NFT' },
  {
    id: TRANSACTION_ACTION_NAMES[ACTIONS.addPublicAddress],
    name: 'Add Public Address',
  },
  {
    id: TRANSACTION_ACTION_NAMES[ACTIONS.registerFioAddress],
    name: 'Register FIO Handle',
  },
  {
    id: TRANSACTION_ACTION_NAMES[ACTIONS.registerFioDomain],
    name: 'Register FIO Domain',
  },
  {
    id: TRANSACTION_ACTION_NAMES[ACTIONS.renewFioDomain],
    name: 'Renew FIO Domain',
  },
  {
    id: TRANSACTION_ACTION_NAMES[ACTIONS.removeAllPublicAddresses],
    name: 'Remove All Public Addresses',
  },
  {
    id: TRANSACTION_ACTION_NAMES[ACTIONS.removePublicAddresses],
    name: 'Remove Public Address',
  },
  {
    id: TRANSACTION_ACTION_NAMES[ACTIONS.setFioDomainVisibility],
    name: 'Change FIO Domain Visibility',
  },
  {
    id: TRANSACTION_ACTION_NAMES[ACTIONS.stakeFioTokens],
    name: 'Stake FIO Tokens',
  },
  {
    id: TRANSACTION_ACTION_NAMES[ACTIONS.transferFioAddress],
    name: 'Transfer FIO Address',
  },
  {
    id: TRANSACTION_ACTION_NAMES[ACTIONS.transferFioDomain],
    name: 'Transfer FIO Domain',
  },
  {
    id: TRANSACTION_ACTION_NAMES[ACTIONS.transferTokens],
    name: 'Transfer FIO Tokens',
  },
  {
    id: TRANSACTION_ACTION_NAMES[ACTIONS.unStakeFioTokens],
    name: 'Unstake FIO Tokens',
  },
  {
    id: CUSTOM_ACTION_NAME,
    name: 'Custom action',
  },
  // { id: ACTIONS.wrapFioDomain, name: 'Wrap FIO Domain' },
  // { id: ACTIONS.wrapFioTokens, name: 'Wrap FIO Tokens' },
  {
    id: TRANSACTION_ACTION_NAMES[ACTIONS.cancelFundsRequest],
    name: 'Cancel Funds Request',
  },
  // { id: ACTIONS.recordObtData, name: 'Record Obt Data' },
  // { id: ACTIONS.rejectFundsRequest, name: 'Reject Funds Request' },
  {
    id: TRANSACTION_ACTION_NAMES[ACTIONS.requestFunds],
    name: 'Create FIO Request',
  },
];
