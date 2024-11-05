import {
  BlockProducersItemProps,
  CandidateProps,
} from '../../types/governance';

export type GovernancePageContextProps = {
  bpLoading: boolean;
  listOfBlockProducers: BlockProducersItemProps[];
  listOfCandidates: CandidateProps[];
  loading: boolean;
  onBlockProducerSelectChange: (id: string) => void;
  onCandidateSelectChange: (id: string) => void;
  resetSelectedBlockProducers: () => void;
  resetSelectedCandidates: () => void;
};
