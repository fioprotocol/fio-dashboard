import { FioAccountProfile } from '../../types';

export type FormValuesProps = {
  id?: string;
  name: string;
  actor: string;
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
