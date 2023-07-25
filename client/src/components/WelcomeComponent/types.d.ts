import { PAGE_TYPES_PROPS } from './constants';

export type DefaultWelcomeComponentProps = {
  firstFromListFioAddressName: string;
  firstFromListFioDomainName: string;
  firstFromListFioWalletPublicKey: string;
  hasAffiliate: boolean;
  hasDomains: boolean;
  hasExpiredDomains: boolean;
  hasFCH: boolean;
  hasNoStakedTokens: boolean;
  hasOneDomain: boolean;
  hasOneFCH: boolean;
  hasZeroTotalBalance: boolean;
  loading: boolean;
  noMappedPubAddresses: boolean;
  pageType?: PAGE_TYPES_PROPS;
};
