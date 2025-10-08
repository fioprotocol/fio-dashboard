import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import { EndPoint } from '@fioprotocol/fiosdk';

import { ROUTES } from '../../constants/routes';

import {
  isAffiliateEnabled as isAffiliateEnabledSelector,
  user as userSelector,
} from '../../redux/profile/selectors';
import { fioAddresses as fioAddressesSelector } from '../../redux/fio/selectors';

import { updateAffiliate } from '../../redux/profile/actions';
import { onDomainRenew } from '../../redux/cart/actions';
import { getFee } from '../../redux/fio/actions';

import useEffectOnce from '../../hooks/general';
import { useGetAllFioNamesAndWallets } from '../../hooks/fio';

import {
  FioAffiliateProgramPageContextProps,
  FioDomainSelectable,
  FormValuesProps,
} from './types';
import { RefProfileDomain } from '../../types';

import { useCheckIfDesktop } from '../../screenType';
import { isDomainExpired } from '../../util/fio';
import { QUERY_PARAMS_NAMES } from '../../constants/queryParams';
import { DOMAIN_TYPE } from '../../constants/fio';

const ITEMS_LIMIT = 20;

export const useContext = (): FioAffiliateProgramPageContextProps => {
  const dispatch = useDispatch();
  const isAffiliateEnabled = useSelector(isAffiliateEnabledSelector);
  const user = useSelector(userSelector);
  const fioAddresses = useSelector(fioAddressesSelector);
  const history = useHistory();

  const isDesktop = useCheckIfDesktop();
  const { fioDomains, loading } = useGetAllFioNamesAndWallets();
  const [
    selectedFioDomain,
    selectFioDomain,
  ] = useState<FioDomainSelectable | null>(null);
  const [refProfileDomains, setRefProfileDomains] = useState<
    RefProfileDomain[] | null
  >(null);

  const [showModal, toggleShowModal] = useState(false);
  const [showItemModal, toggleShowItemModal] = useState(false);

  const [visibleItemsCount, setVisibleItemsCount] = useState(ITEMS_LIMIT);

  const onOpenModal = useCallback(() => toggleShowModal(true), []);
  const onCloseModal = useCallback(() => toggleShowModal(false), []);

  const onItemModalOpen = useCallback(domain => {
    toggleShowItemModal(true);
    selectFioDomain(domain);
  }, []);
  const onItemModalClose = useCallback(() => toggleShowItemModal(false), []);

  const onAffiliateUpdate = useCallback(
    (data: FormValuesProps) => {
      dispatch(updateAffiliate(data.fch, data.domains));
      onCloseModal();
    },
    [dispatch, onCloseModal],
  );

  const handleSelect = useCallback(
    (domainName: string) => {
      const domains = [...refProfileDomains];
      const i = domains?.findIndex(
        ({ name }: RefProfileDomain) => name === domainName,
      );
      if (i < 0) {
        const selected = fioDomains.find(({ name }) => name === domainName);

        domains.push({
          name: selected.name,
          isPremium: true,
          rank: 0,
          isFirstRegFree: false,
          domainType: DOMAIN_TYPE.PREMIUM,
          allowFree: false,
          hasGatedRegistration: false,
          isExpired: isDomainExpired(selected.name, selected.expiration),
          expirationDate: selected.expiration,
        });
      } else {
        domains?.splice(i, 1);
      }
      if (user?.affiliateProfile?.tpid) {
        onAffiliateUpdate({
          fch: user?.affiliateProfile?.tpid,
          domains,
        });
        setRefProfileDomains(domains);
      }
    },
    [
      fioDomains,
      refProfileDomains,
      user?.affiliateProfile?.tpid,
      onAffiliateUpdate,
    ],
  );
  const handleRenewDomain = (domain: string) =>
    dispatch(onDomainRenew({ domain }));
  const handleVisibilityChange = (domain: string) =>
    history.push({
      pathname: ROUTES.FIO_DOMAIN_STATUS_CHANGE,
      search: `${QUERY_PARAMS_NAMES.NAME}=${domain}`,
      state: { backPath: ROUTES.FIO_AFFILIATE_PROGRAM_ENABLED },
    });

  const loadMore = useCallback(() => {
    setVisibleItemsCount(visibleItemsCount + ITEMS_LIMIT);
  }, [visibleItemsCount]);

  const hasNextPage = visibleItemsCount < fioDomains.length;

  useEffectOnce(
    () => {
      if (!isAffiliateEnabled) {
        history.push({ pathname: ROUTES.FIO_AFFILIATE_PROGRAM_LANDING });
      }
    },
    [isAffiliateEnabled, history],
    !isAffiliateEnabled,
  );

  useEffect(() => {
    dispatch(getFee(EndPoint.renewFioDomain));
  }, [dispatch]);

  useEffect(() => {
    setRefProfileDomains(user?.affiliateProfile?.settings?.domains || []);
  }, [user?.affiliateProfile?.settings?.domains]);

  return {
    isDesktop,
    showModal,
    onCloseModal,
    onOpenModal,
    showItemModal,
    onItemModalOpen,
    onItemModalClose,
    fioAddresses,
    onAffiliateUpdate,
    handleSelect,
    handleRenewDomain,
    handleVisibilityChange,
    hasNextPage,
    loadMore,
    loading,
    domains: fioDomains
      .map(fioDomain => ({
        selected: !!user?.affiliateProfile?.settings?.domains?.find(
          (domain: RefProfileDomain) => domain.name === fioDomain.name,
        ),
        ...fioDomain,
      }))
      .slice(0, !hasNextPage ? fioDomains.length : visibleItemsCount),
    user,
    selectedFioDomain,
    link: `${window.location.origin}/ref/${user?.affiliateProfile
      ?.code as string}`,
    fchLink: `${window.location.origin}/ref/handle/${user?.affiliateProfile
      ?.code as string}`,
    tpid: user?.affiliateProfile?.tpid,
  };
};
