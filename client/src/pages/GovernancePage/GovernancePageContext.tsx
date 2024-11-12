import { useCallback, useEffect, useState } from 'react';

import {
  useDetailedProxies,
  useGetBlockProducers,
  useGetCandidates,
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

  const { loading, candidatesList } = useGetCandidates();
  const { loading: bpLoading, blockProducersList } = useGetBlockProducers();
  const { loading: proxiesLoading, proxyList } = useDetailedProxies();

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

  return {
    bpLoading,
    listOfBlockProducers,
    listOfCandidates,
    listOfProxies,
    loading,
    proxiesLoading,
    onBlockProducerSelectChange,
    onCandidateSelectChange,
    onProxySelectChange,
    resetSelectedBlockProducers,
    resetSelectedCandidates,
    resetSelectedProxies,
  };
};
