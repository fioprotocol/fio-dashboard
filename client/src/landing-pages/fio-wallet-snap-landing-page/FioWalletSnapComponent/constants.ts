import { ACTIONS, TRANSACTION_ACTION_NAMES } from '../../../constants/fio';

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
  // {
  //   id: TRANSACTION_ACTION_NAMES[ACTIONS.cancelFundsRequest],
  //   name: 'Cancel Funds Request',
  // },
  // { id: ACTIONS.recordObtData, name: 'Record Obt Data' },
  {
    id: TRANSACTION_ACTION_NAMES[ACTIONS.registerFioAddress],
    name: 'Register FIO Handle',
  },
  {
    id: TRANSACTION_ACTION_NAMES[ACTIONS.registerFioDomain],
    name: 'Register FIO Domain',
  },
  // { id: ACTIONS.registerOwnerFioDomain, name: 'Register Owner FIO Domain' },
  // { id: ACTIONS.rejectFundsRequest, name: 'Reject Funds Request' },
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
  // { id: TRANSACTION_ACTION_NAMES[ACTIONS.requestFunds], name: 'Request Funds' },
  {
    id: TRANSACTION_ACTION_NAMES[ACTIONS.setFioDomainVisibility],
    name: 'Change FIO Domain Visibility',
  },
  // { id: ACTIONS.stakeFioTokens, name: 'Stake FIO Tokens' },
  // { id: ACTIONS.transferFioAddress, name: 'Transfer FIO Address' },
  // { id: ACTIONS.transferFioDomain, name: 'Transfer FIO Domain' },
  // { id: ACTIONS.transferTokens, name: 'Transfer Tokens' },
  // { id: ACTIONS.unStakeFioTokens, name: 'Unstake FIO Tokens' },
  // { id: ACTIONS.wrapFioDomain, name: 'Wrap FIO Domain' },
  // { id: ACTIONS.wrapFioTokens, name: 'Wrap FIO Tokens' },
];
