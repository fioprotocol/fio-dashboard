import { useCallback, useEffect, useState } from 'react';

import { useCheckIfDesktop } from '../../../screenType';
import { log, transformBaseUrl } from '../../../util/general';
import apis from '../api';

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
  const [isApiReady, setIsApiReady] = useState(false);
  const [isValidating, toggleIsValidating] = useState<boolean>(false);

  const [, fioHandle] = window.location.pathname.split('/');

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    apis.fioReg
      .apiUrls()
      .then(apis.fio.setApiUrls)
      .then(() => setIsApiReady(true));
  }, []);

  useEffect(() => {
    if (!isApiReady || !fioHandle) {
      return;
    }

    toggleIsValidating(true);

    validateFCH(fioHandle).then(isValid => {
      if (!isValid) {
        resetPath();
        return;
      }

      if (!!fioHandle || window.location.search || window.location.hash) {
        window.history.pushState({}, null, `/${fioHandle}`);
      }

      setFch(fioHandle);
    });

    toggleIsValidating(false);
  }, [fioHandle, isApiReady, resetPath, validateFCH]);

  return { fioBaseUrl, fch, isDesktop, isValidating, resetPath, setFch };
};
