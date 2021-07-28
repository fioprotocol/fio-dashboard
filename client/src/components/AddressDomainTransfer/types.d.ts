import {
  FioWalletDoublet,
  PageNameType,
  AddressDomainItemProps,
} from '../../types';

export type ContainerProps = {
  children?: React.ReactNode;
  data: AddressDomainItemProps[];
  feePrice: { costFio: number; costUsdc: number };
  fioWallets: FioWalletDoublet[];
  loading: boolean;
  name: string;
  pageName: PageNameType;
  refreshBalance: (publicKey: string) => void;
};
