import { useCallback, useEffect, useState } from 'react';

import { useGetCandidates } from '../../hooks/governance';

import { CandidateProps } from '../../types/governance';
import { GovernancePageContextProps } from './types';

export const useContext = (): GovernancePageContextProps => {
  const [listOfCandidates, setListOfCandidates] = useState<CandidateProps[]>(
    [],
  );
  const { loading, candidatesList } = useGetCandidates();

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

  return {
    listOfCandidates,
    loading,
    onCandidateSelectChange,
    resetSelectedCandidates,
  };
};
