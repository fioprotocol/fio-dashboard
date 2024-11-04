import { CandidateProps } from '../../types/governance';

export type GovernancePageContextProps = {
  listOfCandidates: CandidateProps[];
  loading: boolean;
  onCandidateSelectChange: (id: string) => void;
  resetSelectedCandidates: () => void;
};
