import { AdminPartnersListResponse } from '../../api/responses';
import { FioAccountProfile, FioAccountProfileType } from '../../types';

export type FormValuesProps = {
  id?: string;
  name: string;
  actor: string;
  accountType?: FioAccountProfileType;
  permission: string;
  domains?: string[];
};

export type PageProps = {
  loading: boolean;
  fioAccountsProfilesCount: number;
  fioAccountsProfilesList: FioAccountProfile[];
  partnersList: AdminPartnersListResponse;
  getFioAccountsProfilesList: (
    limit?: number,
    offset?: number,
  ) => Promise<void>;
  getPartnersList: (limit?: number, offset?: number) => Promise<void>;
};
