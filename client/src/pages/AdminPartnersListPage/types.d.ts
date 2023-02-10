import { FioAccountProfile, RefProfile } from '../../types';

export type Props = {
  fioAccountLoading: boolean;
  loading: boolean;
  fioAccountsProfilesList: FioAccountProfile[];
  partnersList: RefProfile[];
  getFioAccountsProfilesList: () => Promise<void>;
  getPartnersList: (limit?: number, offset?: number) => Promise<void>;
};
