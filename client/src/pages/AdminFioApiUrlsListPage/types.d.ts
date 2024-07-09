import { FioApiUrl } from '../../types';

export type FormValuesProps = {
  id?: string;
  rank: number;
  type: string;
  url: string;
};

export type FormValuesEditProps = {
  id: string;
  rank: number;
  url: string;
};

export type PageProps = {
  loading: boolean;
  fioApiUrlsCount: number;
  fioApiUrlsList: FioApiUrl[];
  getFioApiUrlsList: (limit?: number, offset?: number) => Promise<void>;
};
