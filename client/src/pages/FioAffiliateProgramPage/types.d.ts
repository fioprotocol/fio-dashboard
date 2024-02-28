import { FioAddressDoublet, User } from '../../types';

export type FormValuesProps = {
  fch: string;
};

export type FioAffiliateProgramPageContextProps = {
  showModal: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  fioAddresses: FioAddressDoublet[];
  onAffiliateUpdate: (values: FormValuesProps) => void;
  user: User;
  link: string;
  tpid: string;
};
