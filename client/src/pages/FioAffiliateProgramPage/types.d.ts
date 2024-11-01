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
  showModal: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  fioAddresses: FioAddressDoublet[];
  onAffiliateUpdate: (values: FormValuesProps) => void;
  handleSelect: (name: string) => void;
  handleRenewDomain: (name: string) => void;
  handleVisibilityChange: (name: string) => void;
  user: User;
  domains: FioDomainSelectable[];
  loading: boolean;
  link: string;
  fchLink: string;
  tpid: string;
};
