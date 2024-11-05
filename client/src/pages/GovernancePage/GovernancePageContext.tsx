import { useCallback, useEffect, useState } from 'react';

import { useGetBlockProducers, useGetCandidates } from '../../hooks/governance';

import {
  BlockProducersItemProps,
  CandidateProps,
} from '../../types/governance';
import { GovernancePageContextProps } from './types';

export const useContext = (): GovernancePageContextProps => {
  const [listOfCandidates, setListOfCandidates] = useState<CandidateProps[]>(
    [],
  );
  const [listOfBlockProducers, setListOfBlockProducers] = useState<
    BlockProducersItemProps[]
  >([]);

  const { loading, candidatesList } = useGetCandidates();
  const { loading: bpLoading, blockProducersList } = useGetBlockProducers();

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

  return {
    bpLoading,
    listOfBlockProducers,
    listOfCandidates,
    loading,
    onBlockProducerSelectChange,
    onCandidateSelectChange,
    resetSelectedBlockProducers,
    resetSelectedCandidates,
  };
};
