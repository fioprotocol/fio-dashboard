export const SOCIAL_MEDIA_CONTAINER_NAMES = {
  ADD_SOCIAL_MEDIA: 'addSocialMedia',
  EDIT_SOCIAL_MEDIA: 'editSocialMedia',
  DELETE_SOCIAL_MEDIA: 'deleteSocialMedia',
} as const;

export const CONTAINER_NAMES = {
  DELETE: 'delete',
  EDIT: 'edit',
  ADD: 'add',
  ...SOCIAL_MEDIA_CONTAINER_NAMES,
};

export const ACTION_SUCCESS_MESSAGES = {
  [SOCIAL_MEDIA_CONTAINER_NAMES.ADD_SOCIAL_MEDIA]:
    'The social media account has been linked.',
  [SOCIAL_MEDIA_CONTAINER_NAMES.EDIT_SOCIAL_MEDIA]:
    'The social media account has been edited.',
  [SOCIAL_MEDIA_CONTAINER_NAMES.DELETE_SOCIAL_MEDIA]:
    'The social media account has been deleted.',
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
    title: 'Link your FIO Handle',
    buttonText: 'Link Now',
  },
  [CONTAINER_NAMES.ADD_SOCIAL_MEDIA]: {
    title: 'Link Social Media',
    buttonText: 'Link',
  },
  [CONTAINER_NAMES.EDIT_SOCIAL_MEDIA]: {
    title: 'Edit Social Media Links',
    buttonText: 'Edit',
  },
  [CONTAINER_NAMES.DELETE_SOCIAL_MEDIA]: {
    title: 'Delete Social Media Links',
    buttonText: 'Delete',
  },
};

export const LOW_BALANCE_TEXT = {
  buttonText: 'Add more bundled transactions',
  messageText:
    'Unfortunately there are not enough bundled transactions available to complete linking. Please add more to your address now.',
};
