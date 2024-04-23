import { PAGE_TYPES_PROPS } from './constants';

export type DefaultWelcomeComponentProps = {
  firstFromListFioAddressName: string;
  firstFromListFioDomainName: string;
  firstFromListFioWalletPublicKey: string;
  hasAffiliate: boolean;
  hasDomains: boolean;
  hasAddresses: boolean;
  hasExpiredDomains: boolean;
  hasFCH: boolean;
  hasNoEmail: boolean;
  hasNoStakedTokens: boolean;
  hasOneDomain: boolean;
  hasOneFCH: boolean;
  hasZeroTotalBalance: boolean;
  loading: boolean;
  noMappedPubAddresses: boolean;
  pageType?: PAGE_TYPES_PROPS;
  userType: string;
};

export type ActionButtonLink = {
  pathname: string;
  state?: { openSettingsModal: string };
  search?: string;
};
