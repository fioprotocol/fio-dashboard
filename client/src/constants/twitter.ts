import { BADGE_TYPES } from '../components/Badge/Badge';

export const TWITTER_VERIFY_EXPIRATION_TIME = 180000;
export const TWITTER_VERIFY_TIME = 5000;
export const REACT_SNAP_AGENT = 'ReactSnap';

export const STEPS = {
  ONE: {
    stepId: 1,
    stepNumber: 'Step One',
    stepText: 'Enter YOUR Twitter handle',
  },
  TWO: {
    stepId: 2,
    stepNumber: 'Step Two',
    stepText:
      'Validate your twitter handle ownership by sending the tweet below.',
  },
  THREE: {
    stepId: 3,
    stepNumber: 'Step Three',
    stepText: 'Complete your registration by clicking the “get it” button.',
  },
};

export const ADDRESS_WIDGET_CONTENT = {
  title: 'Your Twitter handle can now receive crypto',
  subtitle:
    'Set-up yourhandle@twitter FIO Handle and map it to your wallet address.',
  initialValues: {
    domain: 'twitter',
  },
  fch: 'bob@twitter',
  suffixText: '@twitter',
  placeHolderText: 'Enter Your Twitter Handle',
  inputButtonText: 'GO',
  inputButtonTextLastStep: 'GET IT',
};

export const TWITTER_SHARE_CONTENT = {
  text:
    'My name@domain Twitter handle can now receive crypto. #CRYPTO Get your own $FIO Handle for free now! ',
  url: `${document.location.href}`,
  hashtags: ['#CRYPTO'],
  via: 'joinfio',
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
  MISSING_HANDLE: {
    title: 'Missing Twitter handle',
    messgae: 'Please type the handle in the input below.',
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
  TRY_AGAIN: {
    title: 'Try Again',
    message: 'We could not verify your twitter handle.',
  },
  LOCKED: {
    title: 'Verification in Progress',
    message:
      'This handle is currently being verified by another user. Try again in 30 minutes.',
  },
  NOT_SUPPORTED: {
    title: 'Handle not supported',
    message:
      'Handles which start or end with underscore or dash are not supported at this time.',
  },
  CONVERTED: {
    title: 'Underscore become dash',
    message:
      'FIO Handles only support dashes so all underscores are replaced with dashes.',
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
  MISSING_HADNLE: {
    hasNotification: true,
    type: BADGE_TYPES.ERROR,
    message: TWITTER_NOTIFICATIONS_CONTENT.MISSING_HANDLE.messgae,
    title: TWITTER_NOTIFICATIONS_CONTENT.MISSING_HANDLE.title,
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
  TRY_AGAIN: {
    hasNotification: true,
    type: BADGE_TYPES.ERROR,
    message: TWITTER_NOTIFICATIONS_CONTENT.TRY_AGAIN.message,
    title: TWITTER_NOTIFICATIONS_CONTENT.TRY_AGAIN.title,
  },
  LOCKED: {
    hasNotification: true,
    type: BADGE_TYPES.ERROR,
    message: TWITTER_NOTIFICATIONS_CONTENT.LOCKED.message,
    title: TWITTER_NOTIFICATIONS_CONTENT.LOCKED.title,
  },
  NOT_SUPPORTED: {
    hasNotification: true,
    type: BADGE_TYPES.ERROR,
    message: TWITTER_NOTIFICATIONS_CONTENT.NOT_SUPPORTED.message,
    title: TWITTER_NOTIFICATIONS_CONTENT.NOT_SUPPORTED.title,
  },
  CONVERTED: {
    hasNotification: true,
    type: BADGE_TYPES.INFO,
    message: TWITTER_NOTIFICATIONS_CONTENT.CONVERTED.message,
    title: TWITTER_NOTIFICATIONS_CONTENT.CONVERTED.title,
  },
};
