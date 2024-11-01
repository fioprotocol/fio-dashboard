import {
  FioAddressDoublet,
  FioNameItemProps,
  RefProfileDomain,
  User,
} from '../../types';

export type FormValuesProps = {
  fch: string;
  domains: RefProfileDomain[];
};

export type FioDomainSelectable = FioNameItemProps & { selected: boolean };

export type FioAffiliateProgramPageContextProps = {
  isDesktop: boolean;

  showModal: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;

  showItemModal: boolean;
  onItemModalOpen: (domain: FioDomainSelectable) => void;
  onItemModalClose: () => void;

  onAffiliateUpdate: (values: FormValuesProps) => void;
  handleSelect: (name: string) => void;
  handleRenewDomain: (name: string) => void;
  handleVisibilityChange: (name: string) => void;

  user: User;
  fioAddresses: FioAddressDoublet[];
  domains: FioDomainSelectable[];

  loading: boolean;
  selectedFioDomain: FioDomainSelectable | null;
  link: string;
  fchLink: string;
  tpid: string;
};
