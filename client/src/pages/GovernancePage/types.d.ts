import { DetailedProxy } from '../../types';
import {
  BlockProducersItemProps,
  CandidateProps,
} from '../../types/governance';

export type GovernancePageContextProps = {
  bpLoading: boolean;
  listOfBlockProducers: BlockProducersItemProps[];
  listOfCandidates: CandidateProps[];
  listOfProxies: DetailedProxy[];
  loading: boolean;
  proxiesLoading: boolean;
  onBlockProducerSelectChange: (id: string) => void;
  onCandidateSelectChange: (id: string) => void;
  onProxySelectChange: (id: number) => void;
  resetSelectedBlockProducers: () => void;
  resetSelectedCandidates: () => void;
  resetSelectedProxies: () => void;
};
