import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import {
  useDetailedProxies,
  useGetBlockProducers,
  useGetCandidates,
  useOveriewWallets,
} from '../../hooks/governance';

import {
  BlockProducersItemProps,
  CandidateProps,
} from '../../types/governance';
import { GovernancePageContextProps } from './types';
import { DetailedProxy } from '../../types';

export const useContext = (): GovernancePageContextProps => {
  const [listOfCandidates, setListOfCandidates] = useState<CandidateProps[]>(
    [],
  );
  const [listOfBlockProducers, setListOfBlockProducers] = useState<
    BlockProducersItemProps[]
  >([]);
  const [listOfProxies, setListOfProxies] = useState<DetailedProxy[]>([]);
  const [activeWalletPublicKey, setActiveWalletPublicKey] = useState<
    string | null
  >(null);
  const [isWalletDetailsModalOpen, toggleIsWalletDetailsModalOpen] = useState<
    boolean
  >(false);

  const { loading, candidatesList } = useGetCandidates();
  const { loading: bpLoading, blockProducersList } = useGetBlockProducers();
  const { loading: proxiesLoading, proxyList } = useDetailedProxies();
  const {
    loading: overviewWalletsLoading,
    overviewWallets,
  } = useOveriewWallets();

  const history = useHistory<{ shouldOpenFirstWallet: boolean }>();

  const historyState = history.location?.state;
  const { shouldOpenFirstWallet } = historyState || {};

  const clearRouterState = useCallback(() => {
    const state = history.location?.state;

    if (state) {
      delete state.shouldOpenFirstWallet;
    }

    history.replace({ ...history.location, state });
  }, [history]);

  const onCandidateSelectChange = useCallback((id: string) => {
    setListOfCandidates(prevCandidates =>
      prevCandidates.map(candidate =>
        candidate.id === id
          ? { ...candidate, checked: !candidate.checked }
          : candidate,
      ),
    );
  }, []);

  const resetSelectedCandidates = useCallback(() => {
    setListOfCandidates(
      listOfCandidates.map(candidate => ({ ...candidate, checked: false })),
    );
  }, [listOfCandidates]);

  const onBlockProducerSelectChange = useCallback((id: string) => {
    setListOfBlockProducers(prevBlockProducers =>
      prevBlockProducers.map(bpItem =>
        bpItem.id === id ? { ...bpItem, checked: !bpItem.checked } : bpItem,
      ),
    );
  }, []);

  const resetSelectedBlockProducers = useCallback(() => {
    setListOfBlockProducers(
      listOfBlockProducers.map(bpItem => ({ ...bpItem, checked: false })),
    );
  }, [listOfBlockProducers]);

  const onProxySelectChange = useCallback((id: number) => {
    setListOfProxies(prevProxies =>
      prevProxies.map(proxyItem => ({
        ...proxyItem,
        checked: proxyItem.id === id,
      })),
    );
  }, []);

  const resetSelectedProxies = useCallback(() => {
    setListOfProxies(
      proxyList.map(proxyItem => ({ ...proxyItem, checked: false })),
    );
  }, [proxyList]);

  const openWalletDetailsModal = useCallback((publicKey: string) => {
    setActiveWalletPublicKey(publicKey);
    toggleIsWalletDetailsModalOpen(true);
  }, []);

  const closWalletDetailsModal = useCallback(() => {
    toggleIsWalletDetailsModalOpen(false);
    setActiveWalletPublicKey(null);
  }, []);

  useEffect(() => {
    if (candidatesList?.length) {
      setListOfCandidates(
        candidatesList.map(candidateItem => ({
          ...candidateItem,
          checked: false,
        })),
      );
    }
  }, [candidatesList]);

  useEffect(() => {
    if (blockProducersList?.length) {
      setListOfBlockProducers(
        blockProducersList.map(blockProducerItem => ({
          ...blockProducerItem,
          checked: false,
        })),
      );
    }
  }, [blockProducersList]);

  useEffect(() => {
    if (proxyList?.length) {
      setListOfProxies(
        proxyList.map(proxyItem => ({ ...proxyItem, checked: false })),
      );
    }
  }, [proxyList]);

  useEffect(() => {
    if (shouldOpenFirstWallet && overviewWallets?.length) {
      openWalletDetailsModal(overviewWallets[0].publicKey);
      clearRouterState();
    }
  }, [
    clearRouterState,
    openWalletDetailsModal,
    overviewWallets,
    shouldOpenFirstWallet,
  ]);

  return {
    activeWalletPublicKey,
    bpLoading,
    isWalletDetailsModalOpen,
    listOfBlockProducers,
    listOfCandidates,
    listOfProxies,
    loading,
    overviewWallets,
    overviewWalletsLoading,
    proxiesLoading,
    closWalletDetailsModal,
    onBlockProducerSelectChange,
    onCandidateSelectChange,
    onProxySelectChange,
    openWalletDetailsModal,
    resetSelectedBlockProducers,
    resetSelectedCandidates,
    resetSelectedProxies,
    setActiveWalletPublicKey,
  };
};
