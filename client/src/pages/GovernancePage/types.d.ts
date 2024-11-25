import { DetailedProxy } from '../../types';
import {
  BlockProducersItemProps,
  CandidateProps,
  OverviewWallet,
} from '../../types/governance';

export type GovernancePageContextProps = {
  activeWalletPublicKey: string;
  bpLoading: boolean;
  isWalletDetailsModalOpen: boolean;
  listOfBlockProducers: BlockProducersItemProps[];
  listOfCandidates: CandidateProps[];
  listOfProxies: DetailedProxy[];
  loading: boolean;
  overviewWallets: OverviewWallet[];
  overviewWalletsLoading: boolean;
  proxiesLoading: boolean;
  closWalletDetailsModal: () => void;
  onBlockProducerSelectChange: (id: string) => void;
  onCandidateSelectChange: (id: string) => void;
  onProxySelectChange: (id: number) => void;
  openWalletDetailsModal: (publicKey: string) => void;
  resetSelectedBlockProducers: () => void;
  resetSelectedCandidates: () => void;
  resetSelectedProxies: () => void;
  setActiveWalletPublicKey: (publicKey: string | null) => void;
};
