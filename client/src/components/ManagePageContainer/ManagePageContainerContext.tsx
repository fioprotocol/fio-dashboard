import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useSelector } from 'react-redux';

import { noProfileLoaded as noProfileLoadedSelector } from '../../redux/profile/selectors';

import { ITEMS_LIMIT, PAGE_NAME, WELCOME_COMPONENT_TYPE } from './constants';
import { LOW_BUNDLES_THRESHOLD } from '../../constants/fio';

import { useCheckIfDesktop } from '../../screenType';
import { isDomainExpired } from '../../util/fio';

import { FioNameItemProps, FioNameType, FioWalletDoublet } from '../../types';
import { PAGE_TYPES_PROPS } from '../../pages/DashboardPage/components/WelcomeComponentItem/constants';
import { useGetAllFioNamesAndWallets } from '../../hooks/fio';

type Props = {
  pageName: FioNameType;
};

type UseContextProps = {
  fio101ComponentProps: {
    firstFromListFioAddressName: string;
    hasFCH: boolean;
    hasOneFCH: boolean;
    hasDomains: boolean;
    hideTitle: boolean;
    isDesktop: boolean;
    loading: boolean;
    noMappedPubAddresses: boolean;
    useMobileView: boolean;
  };
  fioWallets: FioWalletDoublet[];
  hasNextPage: boolean;
  isAddress: boolean;
  isDesktop: boolean;
  isEmptyList: boolean;
  listItemsDefaultProps: {
    fioNameList: FioNameItemProps[];
    isAddress: boolean;
    pageName: FioNameType;
  };
  loading: boolean;
  noProfileLoaded: boolean;
  selectedFioNameItem: FioNameItemProps;
  showItemModal: boolean;
  showSettingsModal: boolean;
  showWarnBadge: boolean;
  welcomeComponentProps: {
    firstFromListFioAddressName: string;
    firstFromListFioDomainName: string;
    firstFromListFioWalletPublicKey: string;
    hasAffiliate: boolean;
    hasDomains: boolean;
    hasExpiredDomains: boolean;
    hasFCH: boolean;
    hasNoStakedTokens: boolean;
    hasOneDomain: boolean;
    hasOneFCH: boolean;
    hasZeroTotalBalance: boolean;
    loading: boolean;
    noMappedPubAddresses: boolean;
    noPaddingTop: boolean;
    onlyActions: boolean;
    pageType: PAGE_TYPES_PROPS;
  };
  loadMore: () => void;
  onItemModalClose: () => void;
  onItemModalOpen: (fioNameItem: FioNameItemProps) => void;
  onSettingsClose: () => void;
  onSettingsOpen: (fioNameItem: FioNameItemProps) => void;
  toggleShowWarnBadge: Dispatch<SetStateAction<boolean>>;
};

export const useContext = (props: Props): UseContextProps => {
  const { pageName } = props;

  const noProfileLoaded = useSelector(noProfileLoadedSelector);

  const [showWarnBadge, toggleShowWarnBadge] = useState<boolean>(false);
  const [showItemModal, handleShowModal] = useState(false);
  const [showSettingsModal, handleShowSettings] = useState(false);
  const [selectedFioNameItem, selectFioNameItem] = useState<FioNameItemProps>(
    {},
  );
  const [visibleItemsCount, setVisibleItemsCount] = useState(ITEMS_LIMIT);

  const isDesktop = useCheckIfDesktop();

  const allFioNamesAndWallets = useGetAllFioNamesAndWallets();
  const {
    firstFromListFioAddressName,
    fioAddresses,
    fioDomains,
    fioWallets,
    hasFCH,
    hasOneFCH,
    hasDomains,
    loading,
    noMappedPubAddresses,
  } = allFioNamesAndWallets;

  const isAddress = pageName === PAGE_NAME.ADDRESS;
  const isDomain = pageName === PAGE_NAME.DOMAIN;

  let fioNameList: FioNameItemProps[] = [];
  if (isAddress) fioNameList = fioAddresses;
  if (isDomain) fioNameList = fioDomains;
  const isEmptyList = fioNameList.length === 0;

  const hasNextPage = visibleItemsCount < fioNameList.length;

  const listItemsDefaultProps = {
    fioNameList: fioNameList.slice(
      0,
      !hasNextPage ? fioNameList.length : visibleItemsCount,
    ),
    isAddress,
    pageName,
  };

  const fio101ComponentProps = {
    firstFromListFioAddressName,
    hasFCH,
    hasOneFCH,
    hasDomains,
    hideTitle: true,
    isDesktop,
    loading,
    noMappedPubAddresses,
    useMobileView: true,
  };

  const welcomeComponentProps = {
    ...allFioNamesAndWallets,
    noPaddingTop: true,
    onlyActions: true,
    pageType: WELCOME_COMPONENT_TYPE[pageName],
  };

  const loadMore = useCallback(() => {
    setVisibleItemsCount(visibleItemsCount + ITEMS_LIMIT);
  }, [visibleItemsCount]);

  const onItemModalOpen = useCallback((fioNameItem: FioNameItemProps) => {
    selectFioNameItem(fioNameItem);
    handleShowModal(true);
  }, []);
  const onItemModalClose = useCallback(() => handleShowModal(false), []);

  const onSettingsOpen = useCallback((fioNameItem: FioNameItemProps) => {
    selectFioNameItem(fioNameItem);
    handleShowModal(false);
    handleShowSettings(true);
  }, []);
  const onSettingsClose = useCallback(() => {
    !isDesktop && handleShowModal(true);
    handleShowSettings(false);
  }, [isDesktop]);

  useEffect(() => {
    if (isAddress) {
      toggleShowWarnBadge(
        !!fioAddresses &&
          fioAddresses.some(
            fioAddress => fioAddress.remaining < LOW_BUNDLES_THRESHOLD,
          ),
      );
    }
    if (isDomain) {
      toggleShowWarnBadge(
        !!fioDomains &&
          fioDomains.some(
            fioDomain =>
              fioDomain.expiration &&
              isDomainExpired(fioDomain.name, fioDomain.expiration),
          ),
      );
    }
  }, [fioAddresses, fioDomains, isAddress, isDomain]);

  return {
    fio101ComponentProps,
    fioWallets,
    hasNextPage,
    isAddress,
    isDesktop,
    isEmptyList,
    listItemsDefaultProps,
    loading,
    noProfileLoaded,
    selectedFioNameItem,
    showItemModal,
    showSettingsModal,
    showWarnBadge,
    welcomeComponentProps,
    loadMore,
    onItemModalClose,
    onItemModalOpen,
    onSettingsClose,
    onSettingsOpen,
    toggleShowWarnBadge,
  };
};