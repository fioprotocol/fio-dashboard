export const CONTAINER_NAMES = {
  DELETE: 'delete',
  EDIT: 'edit',
  ADD: 'add',
};

export const CONTAINER_TYPES = {
  [CONTAINER_NAMES.DELETE]: {
    title: 'Delete Public Address(es)',
    buttonText: 'Delete',
  },
  [CONTAINER_NAMES.EDIT]: {
    title: 'Edit Public Address(es)',
    buttonText: 'Edit',
  },
  [CONTAINER_NAMES.ADD]: {
    title: 'Link your FIO Address',
    buttonText: 'Link Now',
  },
};

export const LOW_BALANCE_TEXT = {
  buttonText: 'Renew',
  messageText:
    'Unfortunately there are not enough bundled transactions available to complete linking. Please renew your address now.',
};
