import { useCheckIfSmallDesktop } from '../../../../screenType';

type UseContextProps = {
  isSmallDesktop: boolean;
};

export const useContext = (): UseContextProps => {
  const isSmallDesktop = useCheckIfSmallDesktop();

  return {
    isSmallDesktop,
  };
};
