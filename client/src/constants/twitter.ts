import { BADGE_TYPES } from '../components/Badge/Badge';

export const ADDRESS_WIDGET_CONTENT = {
  title: 'Your Twitter handle can now receive crypto',
  subtitle:
    'Set-up yourhandle@twitter FIO Crypto Handle and map it to your wallet address.',
  initialValues: {
    domain: 'twitter',
  },
  formAction: false,
  fch: 'bob@twitter',
  prefixText: '@twitter',
};

export const TWITTER_SHARE_CONTENT = {
  text:
    'You can now send me crypto to my name@domain $FIO Crypto Handle. #CRYPTOTWITTER Get yours now ',
  url: 'dashboard.fioprotocol.io/twitter-handle',
  hashtags: [''],
  actionText:
    'Please validate your twitter handle ownership by sending the tweet below',
};

export const TWITTER_DOMAIN = 'twitter';

export const TWITTER_NOTIFICATIONS_CONTENT = {
  EXISTING_HANDLE: {
    title: 'Existing Handle',
    message:
      'This handle is already registered. If you own it map it to your public addresses.',
  },
  INVALID_FORMAT: {
    title: 'Invalid Format',
    message:
      'The handle format is not valid. Please update the handle and try again.',
  },
  VERIFIED: {
    title: 'Verified',
    message: 'Your Twitter Handle has been verified',
  },
};

export const TWITTER_NOTIFICATIONS = {
  EMPTY: {
    hasNotification: false,
    type: '',
    message: '',
    title: '',
  },
  EXISTING_HANDLE: {
    hasNotification: true,
    type: BADGE_TYPES.ERROR,
    message: TWITTER_NOTIFICATIONS_CONTENT.EXISTING_HANDLE.message,
    title: TWITTER_NOTIFICATIONS_CONTENT.EXISTING_HANDLE.title,
  },
  INVALID_FORMAT: {
    hasNotification: true,
    type: BADGE_TYPES.ERROR,
    message: TWITTER_NOTIFICATIONS_CONTENT.INVALID_FORMAT.message,
    title: TWITTER_NOTIFICATIONS_CONTENT.INVALID_FORMAT.title,
  },
  VERIFIED: {
    hasNotification: true,
    type: BADGE_TYPES.INFO,
    message: TWITTER_NOTIFICATIONS_CONTENT.VERIFIED.message,
    title: TWITTER_NOTIFICATIONS_CONTENT.VERIFIED.title,
  },
};
