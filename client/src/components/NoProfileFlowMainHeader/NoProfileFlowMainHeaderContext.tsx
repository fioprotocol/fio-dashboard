import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

import { refProfileInfo } from '../../redux/refProfile/selectors';
import { pathname as pathnameSelector } from '../../redux/navigation/selectors';

import useQuery from '../../hooks/useQuery';
import { useWindowSize } from '../../screenType';

import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';

import { RefProfile } from '../../types';

const DESKTOP_WIDTH_SIZE = 1100;

export type NavItemParam = {
  activeEventKey: string;
  isDesktop: boolean;
  refProfileCode: string;
  queryParams: string;
  handleEventKeySelect: (activeKey: string) => void;
};

type UseContextProps = {
  isDesktop: boolean;
  isMenuOpen: boolean;
  navParams: NavItemParam;
  refProfile: RefProfile;
  queryParamsToSet?: string;
  toggleMenuOpen: (isMenuOpen: boolean) => void;
};

export const useContext = (): UseContextProps => {
  const refProfile = useSelector(refProfileInfo);
  const queryParams = useQuery();
  const pathname = useSelector(pathnameSelector);

  const [activeEventKey, setActiveEventKey] = useState<string>(pathname);
  const [isMenuOpen, toggleMenuOpen] = useState<boolean>(false);

  const { width } = useWindowSize();
  const isDesktop = width > DESKTOP_WIDTH_SIZE;

  const handleEventKeySelect = useCallback((eventKey: string) => {
    setActiveEventKey(eventKey);
  }, []);

  const publicKeyQueryParam = queryParams.get(QUERY_PARAMS_NAMES.PUBLIC_KEY);
  const publicKeyCookie = Cookies.get(QUERY_PARAMS_NAMES.PUBLIC_KEY);

  const publicKey = publicKeyQueryParam || publicKeyCookie;

  const queryParamsToSet = publicKey
    ? `${QUERY_PARAMS_NAMES.PUBLIC_KEY}=${publicKey}`
    : null;

  const navParams = {
    activeEventKey,
    isDesktop,
    refProfileCode: refProfile?.code,
    queryParams: queryParamsToSet,
    handleEventKeySelect,
  };

  return {
    isDesktop,
    isMenuOpen,
    navParams,
    refProfile,
    queryParamsToSet,
    toggleMenuOpen,
  };
};
