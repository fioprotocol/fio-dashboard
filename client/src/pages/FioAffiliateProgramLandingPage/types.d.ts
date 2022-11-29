import { FioAddressDoublet } from '../../types';

export type FormValuesProps = {
  fch: string;
};

export type CommonComponentProps = {
  isAuthenticated: boolean;
  isAffiliateEnabled: boolean;
  showLogin: () => void;
  showAffiliateModal: () => void;
};

export type FioAffiliateProgramLandingPageContextProps = {
  loading: boolean;
  isAuthenticated: boolean;
  isAffiliateEnabled: boolean;
  showLogin: () => void;
  fioAddresses: FioAddressDoublet[];
  activateAffiliate: (fch: string) => void;
  showModal: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
};
