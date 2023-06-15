import { useCheckIfDesktop } from '../../../screenType';
import { transformBaseUrl } from '../../../util/general';

type UseContext = {
  fioBaseUrl: string;
  isDesktop: boolean;
};

export const useContext = (): UseContext => {
  const fioBaseUrl = transformBaseUrl();
  const isDesktop = useCheckIfDesktop();

  return { fioBaseUrl, isDesktop };
};
