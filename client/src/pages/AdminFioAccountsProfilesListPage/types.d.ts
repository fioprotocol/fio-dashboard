import { FioAccountProfile, FioAccountProfileType } from '../../types';

export type FormValuesProps = {
  id?: string;
  name: string;
  actor: string;
  accountType?: FioAccountProfileType;
  permission: string;
};

export type PageProps = {
  loading: boolean;
  fioAccountsProfilesCount: number;
  fioAccountsProfilesList: FioAccountProfile[];
  getFioAccountsProfilesList: (
    limit?: number,
    offset?: number,
  ) => Promise<void>;
};
