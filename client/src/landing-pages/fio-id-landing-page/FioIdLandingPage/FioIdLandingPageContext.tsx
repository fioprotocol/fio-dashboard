import { useCallback, useState } from 'react';

import { useCheckIfDesktop } from '../../../screenType';
import { log, transformBaseUrl } from '../../../util/general';
import apis from '../../../api';
import useEffectOnce from '../../../hooks/general';

type UseContext = {
  fioBaseUrl: string;
  fch: string;
  isDesktop: boolean;
  isValidating: boolean;
  resetPath: () => void;
  setFch: (fch: string) => void;
};

export const useContext = (): UseContext => {
  const fioBaseUrl = transformBaseUrl();
  const isDesktop = useCheckIfDesktop();

  const [fch, setFch] = useState<string>('');
  const [isValidating, toggleIsValidating] = useState<boolean>(false);

  const pathnames = window.location.pathname?.split('/');
  const pathname = pathnames[1];

  const validateFCH = useCallback(async (fch: string) => {
    if (!fch) return;

    try {
      apis.fio.isFioAddressValid(fch);

      const isAvail = await apis.fio.availCheck(fch);

      return isAvail && isAvail.is_registered === 1;
    } catch (error) {
      log.info(error);
      return false;
    }
  }, []);

  const resetPath = useCallback(() => {
    setFch('');
    window.history.pushState({}, null, '/');
  }, []);

  useEffectOnce(() => {
    const handlePathChange = async () => {
      toggleIsValidating(true);
      if (!(await validateFCH(pathname))) {
        resetPath();
      } else {
        if (
          pathnames.length > 2 ||
          window.location.search ||
          window.location.hash
        ) {
          window.history.pushState({}, null, `/${pathname}`);
        }
        setFch(pathname);
      }
      toggleIsValidating(false);
    };

    if (pathname) {
      handlePathChange();
    }
  }, [pathname, validateFCH]);

  useEffectOnce(() => {
    window.scrollTo(0, 0);
  }, []);

  return { fioBaseUrl, fch, isDesktop, isValidating, resetPath, setFch };
};
