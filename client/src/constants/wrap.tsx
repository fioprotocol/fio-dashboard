// The wrapping oracles are down: every wrap/unwrap entry point is disabled
// and the wrap/unwrap routes show a notice. Set to false to re-enable.
export const WRAPPING_DISABLED = true;
export const WRAPPING_DISABLED_MESSAGE =
  'Wrapping and unwrapping are temporarily unavailable.';

export const WRAP_ITEM_STATUS = {
  PENDING: 'Pending',
  FAILED: 'Failed',
  COMPLETE: 'Complete',
} as const;

export const WRAP_TYPE = {
  NFT: 'Domains',
  TOKEN: 'Tokens',
} as const;
