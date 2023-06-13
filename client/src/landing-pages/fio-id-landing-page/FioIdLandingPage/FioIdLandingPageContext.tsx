import { transformBaseUrl } from '../../../util/general';

type UseContext = {
  fioBaseUrl: string;
};

export const useContext = (): UseContext => {
  const fioBaseUrl = transformBaseUrl();
  return { fioBaseUrl };
};
