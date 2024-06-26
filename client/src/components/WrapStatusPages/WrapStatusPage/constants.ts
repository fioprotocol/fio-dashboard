import { WRAP_ITEM_STATUS } from '../../../constants/wrap';

export const WRAP_TYPE_FILTER_OPTIONS = [
  { id: 'wrap', name: 'WRAP' },
  { id: 'unwrap', name: 'UNWRAP' },
  { id: 'burned', name: 'BURN' },
];

export const WRAP_ASSETS_FILTER_OPTIONS = [
  { id: 'tokens', name: 'TOKENS' },
  { id: 'domains', name: 'DOMAINS' },
];

export const WRAP_DATE_FILTER_NAMES = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST7DAYS: 'last7days',
  LASTMONTH: 'lastMonth',
  LASTHALFOFYEAR: 'lastHalfOfYear',
};

export const WRAP_DATE_FILTER_OPTIONS = [
  {
    id: '',
    name: 'All',
  },
  {
    id: WRAP_DATE_FILTER_NAMES.TODAY,
    name: 'Today',
  },
  {
    id: WRAP_DATE_FILTER_NAMES.YESTERDAY,
    name: 'Yesterday',
  },
  {
    id: WRAP_DATE_FILTER_NAMES.LAST7DAYS,
    name: 'Last 7 days',
  },
  {
    id: WRAP_DATE_FILTER_NAMES.LASTMONTH,
    name: 'Last month',
  },
  {
    id: WRAP_DATE_FILTER_NAMES.LASTHALFOFYEAR,
    name: 'Last half year',
  },
  {
    id: 'custom',
    name: 'Custom Dates',
  },
];

export const WRAP_ITEM_STATUS_NAME = {
  PENDING: 'Pending',
  FAILED: 'Failed',
  COMPLETE: 'Complete',
};

export const WRAP_STATUS_CONTENT = {
  [WRAP_ITEM_STATUS_NAME.COMPLETE]: {
    text: WRAP_ITEM_STATUS.COMPLETE,
    type: 'primary',
  },
  [WRAP_ITEM_STATUS_NAME.FAILED]: {
    text: WRAP_ITEM_STATUS.PENDING,
    type: 'secondary',
  },
  [WRAP_ITEM_STATUS_NAME.PENDING]: {
    text: WRAP_ITEM_STATUS.PENDING,
    type: 'secondary',
  },
};
