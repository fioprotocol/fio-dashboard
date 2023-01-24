import { FioApiUrl } from '../../types';

export type FormValuesProps = {
  id?: string;
  url: string;
};

export type FormValuesEditProps = {
  id: string;
  url: string;
};

export type PageProps = {
  loading: boolean;
  fioApiUrlsCount: number;
  fioApiUrlsList: FioApiUrl[];
  getFioApiUrlsList: (limit?: number, offset?: number) => Promise<void>;
};
